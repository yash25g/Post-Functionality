import { api, LightningElement } from 'lwc';

export default class DisplayStar extends LightningElement {
    @api answer={}
    listOfCount=[];
    counted = false;
    noRating = true;
    connectedCallback(){
        for(let i=0;i<this.answer.Rating__c;i++){
            this.noRating = false;
            this.listOfCount.push(i);
        }
        this.counted = true;
    }
}