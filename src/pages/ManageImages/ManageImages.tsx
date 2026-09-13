import Stack from 'components/atoms/Stack/Stack';
import {
    FileUploader,
    StorageImage
} from '@aws-amplify/ui-react-storage';
import {
    list,
    remove
} from 'aws-amplify/storage';
import {
    useState,
    useEffect
} from 'react';
import { InteractionControl } from 'components/atoms/InteractionControl/InteractionControl';
import { useAuthenticator } from '@aws-amplify/ui-react';
import './ManageImages.css';
import ButtonRow from 'components/atoms/ButtonRow/ButtonRow';
import { StatusChip } from 'components/atoms/StatusChip/StatusChip';

const ManageImages = () => {
    const [images, setImages] = useState<any[]>([]);
    const {user} = useAuthenticator();

    useEffect(() => {
        getFileList().then((fileList) => {
            setImages(fileList.items);
        });
    }, []);

    const processFile = ({file, key}: { file: any, key: string }) => {
        const processedFile = {
            file,
            key,
            metadata: {
                id: key,
                userId: user.userId,
            },
        };
        return processedFile;
    };

    const getFileList = async () => {
        const result = await list({
            path: 'picture-submissions/',
        });
        console.log(result);
        return result;
    };

    const removeImage = async (image: any) => {
        try {
            await remove({
                path: image.path,
                options: {
                    bucket: 'amplifyTeamDrive',
                },
            });
            getFileList().then((fileList) => {
                setImages(fileList.items);
            });
        } catch (error) {
            console.log('Error ', error);
        }
    };

    return (
        <div className="amplify-wrapper manage-images">
            <Stack spacing="components">
                <FileUploader
                    acceptedFileTypes={['image/*']}
                    path="picture-submissions/"
                    maxFileCount={3}
                    isResumable
                    bucket={'amplifyTeamDrive'}
                    processFile={processFile}
                />
                <ul>
                    {
                        images.length > 0 && images.map((image) => (
                            <li key={image.path}>
                                <StorageImage
                                    alt={''}
                                    path={image.path}
                                />
                                <ButtonRow>
                                    <InteractionControl onClick={() => removeImage(image)}>Delete</InteractionControl>
                                </ButtonRow>
                                <ButtonRow>
                                    <StatusChip>{(image.size / 1024 / 1024).toFixed(2)}Mb</StatusChip>
                                </ButtonRow>
                            </li>
                        ))
                    }
                </ul>
            </Stack>
        </div>
    );
};

export default ManageImages;