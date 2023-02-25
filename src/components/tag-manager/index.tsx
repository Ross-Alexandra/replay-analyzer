import styled from '@emotion/styled';
import React from 'react';
import { Layer } from '../layer';
import _ from 'lodash';
import { Tag } from './tag';
import { Input } from '../input';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    .tag-viewer {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;

        width: 100%;

        padding: 20px 5px;
    }

    input {

    }
`;

interface TagManagerProps extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
    tags: string[];
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({
    tags,
    addTag,
    removeTag,
    ...props
}) => {
    const [nextTag, setNextTag] = React.useState('');

    return (
        <Wrapper {...props}>
            <Layer className='tag-viewer'>
                {_.map(tags, (tag) => 
                    <Tag 
                        key={tag} 
                        label={tag}
                        onClick={() => removeTag(tag)}
                    />
                )}
            </Layer>

            <Input 
                type='text'
                placeholder='Add a tag'
                value={nextTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNextTag(e.target.value);
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (nextTag && e.key === 'Enter') {
                        addTag(nextTag);
                        setNextTag('');
                    }
                }}
            />
        </Wrapper>
    );
};
