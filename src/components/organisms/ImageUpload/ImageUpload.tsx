import {
    SubmitEvent,
    useState,
    ChangeEvent
} from 'react';
import { uploadData } from 'aws-amplify/storage';

import './ImageUpload.css';

import { InteractionControl } from 'components/atoms/InteractionControl/InteractionControl';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface ImageUploadProps {
    onSuccess?: () => void;
}

function ImageUpload({onSuccess}: ImageUploadProps) {
    const {user} = useAuthenticator();
    const [currentPreviews, setCurrentPreviews] = useState<{ name: string, url: string }[]>([]);
    const [thumbnails, setThumbnails] = useState<{ name: string, url: string, blob: Blob }[]>([]);

    const handleClick = async (event: SubmitEvent) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const files = formData.getAll('files');
        if (!files) {
            return;
        }
        for (const file of files as File[]) {
            await uploadData({
                path: `picture-submissions/${file.name}`,
                data: file,
                options: {
                    bucket: 'amplifyTeamDrive',
                    metadata: {
                        id: file.name,
                        userId: user.userId,
                        uploadedBy: user.signInDetails?.loginId || '',
                    },
                }
            }).result;
        }
        for (const file of thumbnails) {
            await uploadData({
                path: `picture-submissions/thumbnails/${file.name}`,
                data: file.blob,
                options: {
                    bucket: 'amplifyTeamDrive',
                    metadata: {
                        id: file.name,
                        userId: user.userId,
                        uploadedBy: user.signInDetails?.loginId || '',
                    },
                }
            }).result;
        }
        setCurrentPreviews([]);
        setThumbnails([]);
        (event.target as HTMLFormElement).reset();
        onSuccess && onSuccess();
    };

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files as ArrayLike<File>);
        setCurrentPreviews(files.map((fileItem: File) => ({
            name: fileItem.name,
            url: URL.createObjectURL(fileItem),
        })));
        files.forEach(async (file) => await makeThumbnail(file, 128));
    };

    const makeThumbnail = async (file: File, size: number) => {
        size ??= 256;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = size;
        canvas.height = size;

        const bitmap = await createImageBitmap(file);
        const {width, height} = bitmap;

        const ratio = Math.max(size / width, size / height);

        const x = (size - (width * ratio)) / 2;
        const y = (size - (height * ratio)) / 2;

        ctx && ctx.drawImage(bitmap, 0, 0, width, height, x, y, width * ratio, height * ratio);

        canvas.toBlob(blob => {
            const item = blob && URL.createObjectURL(blob);
            if (item) {
                setThumbnails((thumbnails) => {
                    return [
                        ...thumbnails,
                        {
                            name: file.name,
                            url: item,
                            blob: blob,
                        },
                    ];
                });
            }
        }, 'image/webp', 1);
    };
    return (
        <div className="image-upload">
            <form onSubmit={handleClick}>
                <input
                    type="file"
                    accept="image/*"
                    name="files"
                    multiple={true}
                    onChange={changeHandler}
                />
                <InteractionControl type="submit">Upload</InteractionControl>
                <div className="image-upload-preview">
                    <ul className="preview-list">
                        {
                            currentPreviews.map((fileItem: { name: string, url: string }) => {
                                return (
                                    <img
                                        key={fileItem.name}
                                        alt=""
                                        src={fileItem.url}
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto'
                                        }}
                                    />
                                );
                            })
                        }
                    </ul>
                </div>
                <div className="image-upload-preview">
                    <ul className="thumbnail-list">
                        {
                            thumbnails.map((fileItem) => {
                                return (
                                    <img
                                        alt={fileItem.name}
                                        src={fileItem.url}
                                    />
                                );
                            })
                        }
                    </ul>
                </div>
            </form>
        </div>
    );
}

export default ImageUpload;