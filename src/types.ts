type Config = {
    enabled: boolean;
    channel_info?: boolean;
    robust_info?: boolean;
};

type Settings = {
    [x: string]: {
        script: string,
        config: Config,
    },
}

type SaveSettings = {
    [x: string]: {
        config: Config,
    }
}
