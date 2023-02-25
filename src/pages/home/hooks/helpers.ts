import _ from 'lodash';

export function getUpdatedMetas(
    allRounds: RoundWithMeta[],
    roundIdsToUpdate: string[],
    tagsToAdd: string[],
    tagsToRemove: string[]
) {
    return allRounds.map(round => {
        if (roundIdsToUpdate.includes(round.meta._id)) {
            return {
                ...round,
                meta: {
                    ...round.meta,
                    tags: _.uniq([
                        ...round.meta.tags,
                        ...tagsToAdd
                    ]).filter(tag => !tagsToRemove.includes(tag))
                }
            };
        }

        return round;
    });
}