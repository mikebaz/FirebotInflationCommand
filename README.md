This is a simple custom Firebot script to use in a command to calculate inflation from a given year to the current year.  It uses the API at 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?' to perform the calculation.

Please don't abuse the API.  It's a free service and I don't want to see it go away.

To use this:
1. Ensure your [bot connection](https://www.youtube.com/watch?v=QllhrNGFuwM&list=PLKM4AhNKMRk4ecbLtTpCk1nXtVKhiWSqV&t=77s) is configured in Firebot.  If you don't have a bot, you should be able to edit the script (**carefully**) by searching for `chatter:"Bot"` in the script, and replacing `Bot` with `Streamer`.  I have not tested this too much because I do have a bot account.
1. Copy the built version from `dist` into your `scripts` folder to make it available (e.g. on Windows, `C:\Users\<username>\AppData\Roaming\Firebot\v5\profiles\Main Profile\scripts`).  (There is a simple batch file that will do this in most Windows cases in the distribution.)
1. Add a `Run Custom Script` effect.
1. Select the `firebotInflationCommand.js` entry in the `Script` dropdown list.

You can then run a command like "!inflation 1980 100" to calculate the value of $100 in 1980 in today's dollars.

This has minimal error handling; it's quick and dirty, but it does what I need.