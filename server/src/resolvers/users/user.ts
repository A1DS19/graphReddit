import { User } from '../../entities/User';
import { MyContext } from '../../types';
import argon2 from 'argon2';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { sendEmail } from '../../util/sendEmail';
import { v4 as uuidv4 } from 'uuid';
import {
  FieldError,
  CreateUserInput,
  UpdateUserInput,
  ChangePasswordInput,
} from './types';
import { FORGET_PASSWORD_PREFIX } from '../../constants';

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    try {
      //no estoy loggeado
      if (!req.session.userId) {
        return null;
      }

      return await em.findOne(User, { id: req.session.userId });
    } catch (err) {
      return null;
    }
  }

  @Mutation(() => UserResponse, { nullable: true })
  async createUser(
    @Arg('input') input: CreateUserInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (input.email.length <= 5) {
      return { errors: [{ field: 'email', msg: 'Email debe tener 5 o mas caracteres' }] };
    }

    if (input.password.length <= 2) {
      return {
        errors: [{ field: 'password', msg: 'Contrasena debe tener 5 o mas caracteres' }],
      };
    }

    const existingUser = await em.findOne(User, { email: input.email.toLowerCase() });

    if (existingUser) {
      return { errors: [{ field: 'email', msg: 'Email ya existe' }] };
    }

    const hashedPassword = await argon2.hash(input.password);
    const user = em.create(User, {
      email: input.email.toLowerCase(),
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);

      //set & create cookie
      req.session.userId = user.id;

      return { user };
    } catch (err) {
      console.error(err);
      return { errors: [{ field: 'server', msg: err.message }] };
    }
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg('input') input: CreateUserInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      const existingUser = await em.findOne(User, {
        email: input.email.toLowerCase(),
      });

      if (!existingUser) {
        return {
          errors: [
            {
              field: 'email',
              msg: 'Datos invalidos',
            },
          ],
        };
      }

      const isValid = await argon2.verify(existingUser.password, input.password);
      if (!isValid) {
        return {
          errors: [
            {
              field: 'password',
              msg: 'Datos invalidos',
            },
          ],
        };
      }

      //set & create cookie
      req.session.userId = existingUser.id;

      return { user: existingUser };
    } catch (err) {
      console.error(err);
      return { errors: [{ field: 'server', msg: err.message }] };
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(process.env.COOKIE_NAME!);

        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { em, redis }: MyContext,
    @Arg('email') email: string
  ): Promise<Boolean | UserResponse> {
    try {
      const user = await em.findOne(User, { email });

      if (!user) {
        //por razones de seguridad no se le dice al usuario
        //si el email no existe
        return true;
      }

      const token = uuidv4();
      //token en redis expira en 3 dias
      await redis.set(
        FORGET_PASSWORD_PREFIX + token,
        user.id,
        'ex',
        1000 * 60 * 60 * 24 * 3
      );

      await sendEmail(
        email,
        'Olvido la contrasena',
        `<a href="http://localhost:3000/auth/reset-password/${token}">Click aqui para resetear contrasena</a>`
      );
      return true;
    } catch (err) {
      return {
        errors: [{ field: '', msg: err.message }],
      };
    }
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('input') input: ChangePasswordInput,
    @Ctx() { redis, em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      if (input.newPassword.length <= 2) {
        return {
          errors: [
            { field: 'newPassword', msg: 'Contrasena debe tener 5 o mas caracteres' },
          ],
        };
      }

      const key = FORGET_PASSWORD_PREFIX + input.token;
      const userId = await redis.get(key);

      if (!userId) {
        return {
          errors: [{ field: 'token', msg: 'token expirado' }],
        };
      }

      const user = await em.findOne(User, { id: userId });

      if (!user) {
        return {
          errors: [{ field: 'token', msg: 'Usuario no existe' }],
        };
      }

      //hash nueva password
      user.password = await argon2.hash(input.newPassword);
      await em.persistAndFlush(user);

      req.session.userId = user.id;

      //quitar token de db
      await redis.del(key);

      return { user };
    } catch (err) {
      return {
        errors: [{ field: 'server', msg: err.message }],
      };
    }
  }
}
