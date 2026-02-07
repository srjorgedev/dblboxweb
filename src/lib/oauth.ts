import { Google, Twitch, Facebook, Twitter } from "arctic";

export const google = new Google(
    import.meta.env.GOOGLE_CLIENT_ID,
    import.meta.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:4321/login/google/callback"
);

export const twitch = new Twitch(
    import.meta.env.TWITCH_CLIENT_ID,
    import.meta.env.TWITCH_CLIENT_SECRET,
    "http://localhost:4321/login/twitch/callback"
);

export const facebook = new Facebook(
    import.meta.env.FACEBOOK_CLIENT_ID,
    import.meta.env.FACEBOOK_CLIENT_SECRET,
    "http://localhost:4321/login/facebook/callback"
);

export const twitter = new Twitter(
    import.meta.env.TWITTER_CLIENT_ID,
    import.meta.env.TWITTER_CLIENT_SECRET,
    "http://localhost:4321/login/twitter/callback"
);