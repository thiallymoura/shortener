import { env } from "../env";

const fallbackShortLinkBase = "brev.ly";

function getHostname(value: string) {
    try {
        return new URL(value).host;
    } catch {
        return value.replace(/^https?:\/\//, "").split("/")[0] || fallbackShortLinkBase;
    }
}

export function getShortLinkBase() {
    return env.frontendUrl ? getHostname(env.frontendUrl) : fallbackShortLinkBase;
}
