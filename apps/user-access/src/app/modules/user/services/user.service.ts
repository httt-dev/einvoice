import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { createUserRequestMapping } from '../mappers';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async create(params: CreateUserTcpRequest) {
        const isExists = await this.userRepository.exists(params.email);

        if (isExists) {
            throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
        }

        const input = createUserRequestMapping(params);

        return this.userRepository.create(input);
    }

    // createKeycloakUser(data: CreateKeycloakUserTcpReq, processId: string) {
    //   return firstValueFrom(
    //     this.authorizerClient
    //       .send<string>(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER, {
    //         data,
    //         processId,
    //       })
    //       .pipe(map((data) => data.data)),
    //   );
    // }

    getUserByUserId(userId: string) {
        return this.userRepository.getByUserId(userId);
    }
}
