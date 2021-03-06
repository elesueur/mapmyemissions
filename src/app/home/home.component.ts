import { Component, ViewChild, OnInit } from '@angular/core';
import { DirectionsRenderer, NguiMapComponent } from '@ngui/map';
import { Subscription } from 'rxjs/Rx';
import { GoogleAnalyticsEventsService } from "../providers/google-analytics.provider";
import { InitParams, FacebookService, UIParams, UIResponse } from 'ngx-facebook';

const KM_TO_MILES = 0.621;
const SOCIAL_COST_PER_LB = 0.0476;  // dollars per pound

class MyMapOptions implements google.maps.MapOptions {
    geoFallbackCenter: any;
    zoom: number;
}

const MODE_STRINGS = {
    'DRIVING': 'Drive',
    'WALKING': 'Walk',
    'BICYCLING': 'Cycling',
    'TRANSIT': 'Public transit',
};

const DRIVING_MODE_STRINGS = {
    'CAR': 'Car',
    'VAN': 'Van',
    'MOTORBIKE': 'Motorcycle',
    'TAXI': 'Taxi',
};

const VEHICLE_TYPE_STRINGS ={
    'CAR-SM-GAS': 'Small gasoline (up to 1.4 L)',
    'CAR-MD-GAS': 'Medium gasoline (1.4 to 2.0 L)',
    'CAR-LG-GAS': 'Large gasoline (over 2.0 L)',
    'CAR-SM-ADF': 'Small diesel (up to 1.4 L)',
    'CAR-MD-ADF': 'Medium diesel (1.4 to 2.0 L)',
    'CAR-LG-ADF': 'Large diesel (over 2.0 L)',
    'CAR-HYBRID': 'Gasoline-hybrid',
    'CAR-ELECTRIC': 'All-Electric',
    'CAR-LPG': 'LPG',
    'CAR-CNG': 'CNG',
    'MOTORBIKE-SM': 'Small (up to 125 cc)',
    'MOTORBIKE-MD': 'Medium (125 to 500 cc)',
    'MOTORBIKE-LG': 'Large (over 500 cc)',
    'VAN-SM-GAS': 'Small gasoline (up to 1.305 ton)',
    'VAN-MD-GAS': 'Medium gasoline (1.305 to 1.74 ton)',
    'VAN-LG-GAS': 'Large gasoline (up to 3.5 ton)',
    'VAN-SM-ADF': 'Small diesel (up to 1.305 ton)',
    'VAN-MD-ADF': 'Medium diesel (1.305 to 1.74 ton)',
    'VAN-LG-ADF': 'Large diesel (up to 3.5 ton)',
    'VAN-LPG': 'LPG',
    'VAN-CNG': 'CNG',
};

const EMISSIONS_MAP = {
    'CAR-SM-GAS': 0.57320,
    'CAR-MD-GAS': 0.70548,
    'CAR-LG-GAS': 1.03617,
    'CAR-SM-ADF': 0.52911,
    'CAR-MD-ADF': 0.63934,
    'CAR-LG-ADF': 0.79366,
    'CAR-HYBRID': 0.46297,
    'CAR-ELECTRIC': 0.01,
    'CAR-LPG': 0.70548,
    'CAR-CNG': 0.63934,
    'MOTORBIKE-SM': 0.30865,
    'MOTORBIKE-MD': 0.37479,
    'MOTORBIKE-LG': 0.48502,
    'VAN-SM-GAS': 0.90390,
    'VAN-MD-GAS': 1.01413,
    'VAN-LG-GAS': 1.23459,
    'VAN-SM-ADF': 0.55116,
    'VAN-MD-ADF': 0.85980,
    'VAN-LG-ADF': 1.01413,
    'VAN-LPG': 0.99208,
    'VAN-CNG': 0.90390,
    'TAXI': 0.57320,
    'SUBWAY': 0.19842,
    'LIGHT-RAIL': 0.17637,
    'HEAVY-RAIL': 0.04409,
    'HEAVY_RAIL': 0.04409,
    'BUS': 0.35274,
};

const FB_APP_ID = '293529794485590';

@Component({
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent {
    @ViewChild(NguiMapComponent) mapComp: NguiMapComponent;

    private _subscriptions: Array<Subscription> = [];

    private directionsService: google.maps.DirectionsService;

    mapOptions: MyMapOptions;
    mapLoaded = false;

    modes: Array<string>;
    modeStrings = MODE_STRINGS;
    drivingMode: string;
    drivingModes: Array<string>;
    drivingModeString = DRIVING_MODE_STRINGS;
    vehicleTypes: Array<string>;
    vehicleType: string;
    vehicleTypeStrings = VEHICLE_TYPE_STRINGS;
    mode: string = 'TRANSIT';
    origin: string = '';
    destination: string = '';
    emissions: number = 0;
    distance: number = 0;
    duration: string = '';
    currentLocation: any;
    buttonEnabled = false;
    socialCost: number = 0;
    activeRoute = false;
    direction: any;
    directionsResult: any;
    height: number;
    co2eSignpostOpen = false;
    socialCostSignpostOpen = false;
    count = 0;
    errorMessage = null;
    fallbackCenter = null;

    constructor(private ga: GoogleAnalyticsEventsService,
                private fb: FacebookService) {
        let initParams: InitParams = {
            appId: FB_APP_ID,
            xfbml: true,
            version: 'v2.8'
        };

        fb.init(initParams);
    }

    ngOnInit() {
        this.fallbackCenter = {lat:40.7128, lng:74.0059};
        this.mapOptions = {
            zoom: 4,
            geoFallbackCenter: this.fallbackCenter,
        };

        this.modes = Object.keys(MODE_STRINGS);
        this.mode = 'TRANSIT';
        this.drivingModes = Object.keys(DRIVING_MODE_STRINGS);
        this.drivingMode = this.drivingModes[0];
        this.vehicleTypes = Object.keys(VEHICLE_TYPE_STRINGS);
        this.vehicleType = this.vehicleTypes[0];
        this.drivingModeChange(this.drivingMode);

        let height = window.innerHeight - 60;
        let a = setInterval(() => {
            window.scrollTo(0, 0);
            this.resize();
        }, 500); // Don't lower more than 500ms, otherwise there will be animation-problems with the  Safari toolbar

        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    resize() {
        if (window.innerHeight != this.height) {
            this.height = window.innerHeight - 60;
        }
    }

    ngAfterContentInit() {
        this.mapComp.mapReady$.subscribe(map => this.mapInitialized());
    }

    drivingModeChange(newMode: string) {
        this.vehicleTypes = Object.keys(VEHICLE_TYPE_STRINGS).filter((item) => {
            return item.startsWith(newMode);
        });

        if (newMode === 'TAXI') {
            this.vehicleType = 'TAXI';
        } else {
            this.vehicleType = this.vehicleTypes[0];
        }
    }

    private mapInitialized() {
        this.directionsService = new google.maps.DirectionsService();

        this._subscriptions.push(this.mapComp.geolocation.getCurrentPosition().subscribe(
            position => {
                this.mapLoaded = true;
                let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                this.currentLocation= latLng;
                this.origin = 'Current Location';
            }));
    }

    destChanged(newDest: any) {
        this.destination = newDest.formatted_address;
        this.validate();
    }

    originChanged(newOrigin: any) {
        this.origin = newOrigin.formatted_address;
        this.validate();
    }

    validate() {
        this.buttonEnabled = this.origin !== '' && this.destination !== '';
    }

    directionsChanged(result: any) {
        this.directionsResult = result.target.directions;

        this.distance = 0;
        this.emissions = 0;

        let route = this.directionsResult.routes[0];
        let leg = route.legs[0];

        // in miles
        this.distance = leg.distance.value / 1000 * KM_TO_MILES;

        this.duration = leg.duration.text;

        for (let step of leg.steps) {
            let emissionsValue = 0;

            switch (step.travel_mode) {
                case google.maps.TravelMode.TRANSIT:
                    if (step.transit && step.transit.line && step.transit.line.vehicle  &&
                            EMISSIONS_MAP[step.transit.line.vehicle.type]) {
                        emissionsValue = EMISSIONS_MAP[step.transit.line.vehicle.type];
                    } else {
                        console.error('no emissions factor for step', step);
                    }
                    break;

                case google.maps.TravelMode.WALKING:
                    emissionsValue = 0;
                    break;

                case google.maps.TravelMode.DRIVING:
                    emissionsValue = EMISSIONS_MAP[this.vehicleType];
                    break;

                case google.maps.TravelMode.BICYCLING:
                    emissionsValue = 0;
                    break;
            }

            this.emissions +=
                (step.distance.value / 1000 * KM_TO_MILES * emissionsValue);

            this.socialCost = this.emissions * SOCIAL_COST_PER_LB;
        }
    }

    showDirection() {
        if (this.origin === '' || this.destination === '') {
            return;
        }

        this.directionsResult = null;

        this.count++;

        this.activeRoute = true;

        this.direction = {
            origin: this.origin,
            destination: this.destination,
            travelMode: this.mode,
        };

        if (this.direction.origin === 'Current Location' && this.currentLocation) {
            this.direction.origin = this.currentLocation;
        }

        this.directionsService.route(this.direction, (response: any, status: any) =>  {
            if (status === google.maps.DirectionsStatus.NOT_FOUND) {
                this.errorMessage = `
                    Sorry, there were no results found for ${this.direction.origin} to ${this.direction.destination}.
                    Try using a more specific address.`;

            } else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
                this.errorMessage = `
                    Sorry, there were no results found for ${this.direction.origin} to ${this.direction.destination}.
                    Try using a more specific address.`;
            } else {
                this.errorMessage = null;
            }
        });

        this.ga.emitEvent('directions', 'showDirections', this.mode, this.count);
    }

    share() {
        let params: any = {
            href: 'https://mapmyemissions.com',
            method: 'share'
        };

        if (this.direction) {
            params.quote = 'I just calculated the greenhouse gas emissions associated with my trip to ' +
                this.direction.destination + ' using mapmyemissions.com. You should try it too!';
        }

        this.fb.ui(params)
            .then((res: UIResponse) => console.log(res))
            .catch((e: any) => console.error(e));
    }
}
