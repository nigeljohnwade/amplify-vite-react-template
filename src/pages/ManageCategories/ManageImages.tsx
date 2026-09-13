import './ManageCategories.css';
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

const ManageImages = () => {
    const [images, setImages] = useState<any[]>([]);
    const {user} = useAuthenticator();

    useEffect(() => {
        getFileList().then((fileList) => {
            setImages(fileList.items);
        });
    }, []);

    // @ts-expect-error dunno how to suppress implicit any here
    const processFile = ({file, key}) => {
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
                            <InteractionControl onClick={() => removeImage(image)}>Delete</InteractionControl>
                        </li>
                    ))
                }
            </ul>
        </Stack>
    );
};

export default ManageImages;