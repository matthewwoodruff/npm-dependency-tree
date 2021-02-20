import {Version} from "../../retriever.types";
import semver from "semver/preload";

export const resolve = (rawVersion: string): Version => {
    const raw = rawVersion;
    try {
        return {
            request: semver.minVersion(rawVersion)?.raw || rawVersion,
            raw
        };
    } catch (e) {
        return { request: raw, raw }
    }
}