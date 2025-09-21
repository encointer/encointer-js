import {ApiPromise} from "@polkadot/api";
import type {Business, BusinessData, CommunityIdentifier} from "@encointer/types";
import type {Vec} from "@polkadot/types";


export async function getBusinesses(api: ApiPromise, cid: CommunityIdentifier): Promise<Vec<Business>> {

    const entry = await api.query["encointerBazaar"]["businessRegistry"].keys(cid);

    const promises = entry.map(({args: [cid, controller]}) => api.query["encointerBazaar"]["businessRegistry"]<BusinessData>(cid, controller).then(business => ({
        controller: controller, business_data: business
    })));

    const businessArray = await Promise.all(promises);

    return api.createType<Vec<Business>>('Vec<Business>', businessArray);
}
