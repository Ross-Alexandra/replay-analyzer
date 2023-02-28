import styled from '@emotion/styled';
import { Modal, ModalFrame, ModalProps } from '@ross-alexandra/react-utilities';
import React from 'react';
import { Button, TagManager } from '../../components';
import { BaseModalWithFrameStyles } from '../styles';

const Wrapper = styled(Modal)`
    ${BaseModalWithFrameStyles}

    .modal-frame {
        display: flex;
        flex-direction: column;

        gap: 20px;
        padding-top: 20px;
    }

    button {
        align-self: flex-start;
    }
`;

interface SetTagsProps extends
    Omit<React.HTMLProps<HTMLDivElement>, 'as'>,
    ModalProps {
        tags: string[];
        addTag: (tag: string) => void;
        removeTag: (tag: string) => void;

        // Update onBackgroundClick to be a
        // required prop
        onBackgroundClick: () => void;
    }

export const SetTags: React.FC<SetTagsProps> = ({
    tags,
    addTag,
    removeTag,
    ...props
}) => {
    return (
        <Wrapper {...props}>
            <ModalFrame
                className='modal-frame'
                handleClose={props.onBackgroundClick}
                closeButtonColor='white'
            >
                <h2>Set Upload Tags</h2>
                <TagManager
                    tags={tags}
                    addTag={addTag}
                    removeTag={removeTag}
                />

                <Button 
                    onClick={props.onBackgroundClick}
                    buttonType='primary'
                >
                    <p>Save</p>
                </Button>
            </ModalFrame>
        </Wrapper>
    );
};
