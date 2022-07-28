import Koa from 'koa';
import { DependencyContainer } from 'tsyringe';
import { StatusCode } from '@digichanges/shared-experience';
import ErrorHttpException from '../../../App/Presentation/Shared/ErrorHttpException';
import AuthService from '../../Domain/Services/AuthService';
import { SERVICES } from '../../../Config/Injects';

const RefreshTokenKoaMiddleware = async(ctx: Koa.ParameterizedContext, next: Koa.Next) =>
{
    const container: DependencyContainer = ctx.container;
    const authService: AuthService = container.resolve<AuthService>(SERVICES.AuthService);
    const refreshToken = ctx.cookies.get('refreshToken');

    if (refreshToken)
    {
        authService.validateRefreshToken(refreshToken);
        ctx.refreshToken = refreshToken;
    }
    else
    {
        throw new ErrorHttpException(StatusCode.HTTP_UNAUTHORIZED, { message: 'Missing refresh token' });
    }

    await next();
};

export default RefreshTokenKoaMiddleware;
