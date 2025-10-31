# Currency Conversion with Uncertainty

This web application converts between currencies while specifying the uncertainty in the currency conversion rate. 
The web application uses the Signaloid technology to allow its users to specify that the conversion rate between GBP and EUR is 1GBP.
The uncertainty of the conversion is modelled as a uniform distribution and users can dictate the range of the distribution.
The web application shows the output distribution of the converted currency.

You can find a deployment of the web application [here](https://candidate-project-timothy-angus.vercel.app/).

## Requirements

### To build the application you need

- Node version: v20.15.1
- Yarn version: 1.22.22
- Vue version: ^3.4.29

### To deploy the application localy

Your Node.js version must be 18.3 or higher. [Install newer version here if needed](https://nodejs.org/en/download/package-manager).

## Run the following commands in the terminal

```sh
git clone git@github.com:TimAngus321/signaloid-currencyConverter-challenge.git
```

```sh
yarn install && yarn format
```

- Add a .env file to the root folder of the project
- Add your signaloid api key using the following name exactly: VITE_SIGNALOID_API_KEY=`your api key here`.

```sh
yarn dev
```

You should then see something like: Local: <http://localhost:5173/> which you can open in your browser of choice.

## To Run Tests

Use the following terminal command:

```sh
yarn test:unit src/stores/__tests__/buildTaskAPI.spec.ts run
```
