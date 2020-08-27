import { PartialTextBasedChannelFields, User } from "discord.js";
import { reactorVote, VoteOptions } from "../internal/reactorVote";

/**
 * Similar to `vote` but is fulfilled when all users have voted.
 *
 * Resolved value:
 * - `fulfilled`: A `VoteResult` that represent the current state of vote when it was fulfilled.
 * - `cancelled`: A `VoteResult` that represent the current state of vote when it was cancelled.
 *
 * @param channel - Channel where the message is posted.
 * @param caption - Message caption.
 * @param list - A list of element.
 * @param users - The list of users that are allowed to vote.
 * @param votePerUser - The number of vote each user can make (default is 1).
 * @param options
 */
export function voteCommittee<T>(
    channel: PartialTextBasedChannelFields,
    caption: string,
    list: readonly T[],
    users: User[],
    votePerUser = 1,
    options?: Omit<VoteOptions<T>, "votePerUser">
) {
    if (votePerUser < 1) throw new Error("votePerUser must be greater than 1.");

    return reactorVote<T>(
        channel,
        caption,
        list,
        { ...options, votePerUser },
        {
            userFilter: (user) => users.some((u) => user.id === u.id),
        },
        {
            onAdd(_, votes) {
                const total = votes.reduce(
                    (prev, cur) => (prev += cur.length),
                    0
                );

                return { submit: total >= users.length * votePerUser };
            },
        }
    );
}