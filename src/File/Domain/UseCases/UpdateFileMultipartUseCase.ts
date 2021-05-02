import IFileRepository from '../../InterfaceAdapters/IFileRepository';
import {REPOSITORIES} from '../../../repositories';
import FileUpdateMultipartPayload from '../../InterfaceAdapters/Payloads/FileUpdateMultipartPayload';
import IFileDomain from '../../InterfaceAdapters/IFileDomain';
import FilesystemFactory from '../../../App/Infrastructure/Factories/FilesystemFactory';
import {containerFactory} from '../../../App/Infrastructure/Factories/ContainerFactory';

class UpdateFileMultipartUseCase
{
    @containerFactory(REPOSITORIES.IFileRepository)
    private repository: IFileRepository;

    async handle(payload: FileUpdateMultipartPayload): Promise<any>
    {
        const id = payload.getId();

        const file: IFileDomain = await this.repository.getOne(id);
        file.extension = payload.getExtension();
        file.originalName = payload.getName();
        file.path = payload.getPath();
        file.mimeType = payload.getMimeType();
        file.size = payload.getSize();
        file.version += 1;

        await this.repository.save(file);

        const filesystem = FilesystemFactory.create();
        await filesystem.uploadFile(file.name, payload.getFile().path);

        return file;
    }
}

export default UpdateFileMultipartUseCase;
