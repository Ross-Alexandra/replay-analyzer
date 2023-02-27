import styled from '@emotion/styled';
import { Modal, ModalFrame, ModalProps } from '@ross-alexandra/react-utilities';
import React, {useCallback, useState, useMemo, useEffect} from 'react';
import _ from 'lodash';

import * as theme from '../../theme';
import { Button, Spinner, TagManager } from '../../components';
import { BaseModalWithFrameStyles } from '../styles';
import { LinkOutIcon } from '../../icons';

const Wrapper = styled(Modal)`
    ${BaseModalWithFrameStyles}

    .modal-frame {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        
        width: 75vw;
        height: 75vh;
    }

    .column {
        display: flex;
        flex-direction: column;
        gap: 10px;

        padding: 10px;
    }

    .left {
        border-right: 1px solid ${theme.colors.border};
    }

    .right {
        align-items: center;
        justify-content: space-evenly;

        text-align: center;
    }

    .modal-background {
        background-color: #00000090;
    }

    .column-section {
        display: flex;
        flex-direction: column;

        width: 100%;
        gap: 10px;

        h2 {
            align-self: flex-start;
            text-align: left;
        }

        button {
            align-self: start;
        }
    }

    .link-out-button {
        display: flex;
        flex-direction: row;
        align-items: center;

        gap: 7px;
    }

    .controls {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        margin-top: auto;
    }

    .warning {
        font-size: 11px;
        opacity: 0.75;

        width: 100%;
    }

    .tag-manager {
        .tag-viewer {
            max-height: 150px;

            overflow-y: auto;
        }
    }
`;

interface ManageRoundsModalProps extends 
    Omit<React.HTMLProps<HTMLDivElement>, 'as'>,
    ModalProps {
        selectedRounds: RoundWithMeta[];
        onBackgroundClick: () => void;
        onRemoveRounds: (round: RoundWithMeta[]) => Promise<void>;
        updateRoundTags: (roundIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => Promise<void>;
    }

export const ManageRoundsModal: React.FC<ManageRoundsModalProps> = ({
    onRemoveRounds,
    selectedRounds,
    updateRoundTags,
    ...props
}) => {
    const originalTags = useMemo(() => _.intersection(...selectedRounds.map((round) => round.meta.tags)), [selectedRounds]);
    const [tags, setTags] = React.useState<string[]>([]);

    useEffect(() => {
        setTags(originalTags);
    }, [originalTags]);

    const addTag = useCallback((tag: string) => {
        setTags((prev) => _.uniq([...prev, _.kebabCase(tag)]));
    }, [setTags]);

    const removeTag = useCallback((tag: string) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    }, [setTags]);

    const [needsShiftClick, setNeedsShiftClick] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [saving, setSaving] = useState(false);

    return (
        <Wrapper
            onClose={() => {
                setNeedsShiftClick(false);
                props.onClose?.();
            }}
            {...props}
        >
            <ModalFrame
                className='modal-frame'
                handleClose={props.onBackgroundClick}
                closeButtonColor='white'
            >
                <div className='left column'>
                    <h2>Edit tags</h2>
                    <TagManager
                        className='tag-manager'
                        tags={tags}
                        addTag={addTag}
                        removeTag={removeTag}
                    />
                    <p className='warning'>Only tags which exist on all selected rounds are shown here</p>

                    <div className='controls'>
                        {saving ? (
                            <Spinner />
                        ) : (
                            <Button
                                buttonType='primary'
                                disabled={_.isEqual(tags, originalTags)}
                                onClick={async () => {
                                    setSaving(true);

                                    const idsToUpdate = selectedRounds.map((round) => round.meta._id);

                                    const removedTags = _.difference(originalTags, tags);
                                    const addedTags = _.difference(tags, originalTags);
                                    await updateRoundTags(idsToUpdate, addedTags, removedTags);

                                    setSaving(false);
                                    props.onBackgroundClick();
                                }}
                            >
                                <p>Save</p>
                            </Button>
                        )}
                    </div>
                    <p className='warning'>Changes here will affect all selected rounds</p>
                </div>
                
                <div className='right column'>
                    <div className='column-section'>
                        <h2>Replay Files</h2>
                        <Button 
                            className='link-out-button'
                            buttonType='primary'
                            onClick={async () => {
                                const fileNames = selectedRounds.map((round) => round.meta.originalFilename);
                                
                                console.log(fileNames[0]);
                                await window.api.showFile(fileNames[0]);
                            }}
                        >
                            <p>Files</p>
                            <LinkOutIcon size={17} />
                        </Button>
                    </div>

                    <div className='column-section'>
                        <h2>Delete Rounds</h2>
                        {deleting ? (
                            <Spinner />
                        ) : (
                            <Button 
                                buttonType='primary'
                                onClick={async (e) => {
                                    if (!e.shiftKey) {
                                        setNeedsShiftClick(true);
                                        return;
                                    }
                                    
                                    setDeleting(true);
                                    await onRemoveRounds(selectedRounds);

                                    setDeleting(false);
                                    props.onBackgroundClick();
                                }}
                            >
                                <p>Delete</p>
                            </Button>
                        )}
                    </div>

                    {needsShiftClick && 
                        <p className='warning'>
                            Warning: This action cannot be undone
                            <br />
                            Please shift-click to confirm you want to delete all rounds.
                        </p>
                    }
                </div>
            </ModalFrame>
        </Wrapper>
    );
};
