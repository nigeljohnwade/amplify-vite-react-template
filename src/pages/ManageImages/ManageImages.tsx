import Stack from 'components/atoms/Stack/Stack';
import { StorageImage } from '@aws-amplify/ui-react-storage';
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
import ImageUpload from 'components/organisms/ImageUpload/ImageUpload';
import { StatusChip } from 'components/atoms/StatusChip/StatusChip';

const ManageImages = () => {
    const [images, setImages] = useState<{ eTag?: string, path: string, size?: number }[]>([]);
    const {user} = useAuthenticator();

    useEffect(() => {
        getFileList().then((fileList) => {
            setImages(fileList.items);
        });
    }, []);

    const processFile = ({file, key}: { file: any, key: string }) => {
        return {
            file,
            key,
            metadata: {
                id: key,
                userId: user.userId,
                userName: user.username,
            },
        };
    };

    const getFileList = async () => {
        const result = await list({
            path: 'picture-submissions/thumbnails/',
        });
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
            <ImageUpload
                onSuccess={() => {
                    getFileList().then((fileList) => {
                        setImages(fileList.items);
                    });
                }}
            />
            <ul className="image-list-thumbnails tile-view">
                {
                    images.length > 0 && images.map((image) => (
                        <li key={image.path}>
                            <StorageImage
                                alt={''}
                                path={image.path}
                            />
                            <StatusChip>
                                {image.path.split('/')[2]}
                            </StatusChip>
                            <ButtonRow>
                                <InteractionControl onClick={() => removeImage(image)}>Delete</InteractionControl>
                            </ButtonRow>
                        </li>
                    ))
                }
            </ul>
        </Stack>
    );
};

export default ManageImages;