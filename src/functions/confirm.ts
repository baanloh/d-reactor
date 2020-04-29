import { Message } from "discord.js";
import emoji from "../emoji";
import { ReactorOptions, reactor, UserFilter } from "../internal/reactor";

/**
 * The returned promised is resolve when user click on one of the added reaction.
 * The resolved value is true if the user click on the check mark reaction, false otherwise.
 * @param message - The message that received reactions.
 * @param userFilter - Determin if a user is allow to react.
 * @param options 
 */
export async function confirm(message: Message, userFilter?: UserFilter, options?: ReactorOptions) {
    return reactor(
        message,
        [emoji.CHECK_MARK, emoji.CROSS_MARK],
        () => false,
        ({reaction, resolve}) => resolve(reaction.emoji.name === emoji.CHECK_MARK),
        userFilter,
        options
    );
}