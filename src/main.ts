import { Firebot, ScriptReturnObject } from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

interface Params {
}

const script: Firebot.CustomScript<Params> = {

    getScriptManifest: () => {
        return {
            name: "Firebot Inflation Command",
            description: "Does an inflation calculation and returns it in chat.",
            author: "Michael C. Bazarewsky",
            version: "1.0.0",
            firebotVersion: "5",
        };
    },

    getDefaultParameters: () => {
        return {
        }
    },

    run: (runRequest) => {
        return new Promise<ScriptReturnObject>(async (resolve, reject) => {
            const { logger } = runRequest.modules;
            logger.debug("Inflation command starting");

            const args = runRequest.trigger.metadata.userCommand.args;

            let message = "";

            if (args.length != 2) {
                message = "Sorry, the command requires the amount and the starting year as numbers.";
            } else {
                let USDollar = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                });

                let amount = parseFloat(args[0]);
                let amountCurrency = USDollar.format(amount);
                let startYear = parseInt(args[1]);
                let startDate = new Date(startYear, 0, 1)
                let startDateString = startDate.toISOString();
                let endDate = new Date();
                let endDateString = endDate.toISOString();
                let endYear = endDate.getFullYear();

                logger.debug(`Amount: ${amount}, startYear: ${startYear}, endYear: ${endYear}, startDate: ${startDateString}, endDate: ${endDateString}`);

                if ((startYear < 1913) || (startDate > endDate)) {
                    message = "Sorry, the starting year must be between 1913 and the current year.  Please be sure to use the amount, followed by the year.";
                } else {
                    const requestObject = {
                        country: 'united-states',
                        start: startDateString,
                        end: endDateString,
                        amount: amount,
                        format: true
                    };
                    const requestParameters = Object.entries(requestObject).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');
                    const apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?' + requestParameters;
                    logger.debug("calling ", apiUrl);
                    try {
                        const response = await fetch(apiUrl)
                        const responseText = (await response.text()).replace(/[\$\(\)\" ]/g, '');
                        logger.debug("responseText: ", responseText);
                        const responseCurrency = USDollar.format(parseFloat(responseText));
                        message = `The inflation-adjusted value of ${amountCurrency} in ${startYear} is ${responseCurrency} in ${endYear}. ( source: https://www.statbureau.org )`;
                    }
                    catch (error) {
                        message = "Sorry, failed to get the inflation data: " + error;
                    }
                    logger.debug(message);
                }
            }

            let effects: Effects.Effect<Effects.KnownEffectType>[] = [];

            // the effect object
            const thisEffect: Effects.Effect<Effects.KnownEffectType> = {
                type: "firebot:chat",
                message: message,
                chatter: "Bot"
            };
            effects.push(thisEffect);

            logger.debug("Done.");

            const response: ScriptReturnObject = {
                success: true,
                errorMessage: "Sorry, failed to get the inflation result.",
                effects: effects
            }

            resolve(response);
        });
    }
};

export default script;
