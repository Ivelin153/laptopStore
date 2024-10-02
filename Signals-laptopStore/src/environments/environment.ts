// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    fundsServiceUrl: 'https://localhost:5001',
    periodServiceUrl: 'https://localhost:5002',
    importServiceUrl: 'https://localhost:5003',
    reportServiceUrl: 'https://localhost:5004',
    reportServerUrl: 'http://afjhb1qlkdbd01/PowerBIReportServer?/Fundi Web - QA',
    adfsClientId: 'urn:dev/af/fundi/web',
    version: '0.0.0.56',
    hmr: false,
};

/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
