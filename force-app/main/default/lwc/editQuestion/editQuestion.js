import { LightningElement, track, wire } from 'lwc';
import LMSCHANNEL from '@salesforce/messageChannel/FirstLMSChannel__c';
import { APPLICATION_SCOPE,subscribe,unsubscribe,MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class EditQuestion extends LightningElement {    
    subscription
    recordId
    showEditQuestion = false;
    @wire(MessageContext) context
    @track isUnSubscribed = false;

    connectedCallback(){
        this.subscribeMessage()
    }

    subscribeMessage(){
        this.isUnSubscribed = false;
        //subscribe(messageContext, messageChannel, listener, subscriberOptions)
        this.subscription= subscribe(this.context, LMSCHANNEL, (message)=>{this.handleMessage(message)}, {scope:APPLICATION_SCOPE})
    }

    handleMessage(message){    
        console.log('Subscribed');    
        this.recordId = message.lmsData.value? message.lmsData.value :'NO Message published'
        this.showEditQuestion = true;
    }
    closeQuestion(){
        this.showEditQuestion = false;
    }

    handleSuccess(event) {
        this.showEditQuestion = false;
        location.reload();
    }

    showToastMessage(title,message,variant){
        const event = new ShowToastEvent({
            title : title,
            message : message,
            variant : variant
        });
        this.dispatchEvent(event);
    }

    handleError(){
        this.showEditQuestion = false;
        this.showToastMessage('No access','You can\'t edit question.','error');
    }

    handleSubmit(event){
        if(!event.detail.fields.Description__c){
            event.preventDefault();
            this.showEditQuestion = false;
            this.showToastMessage('Empty Question','You can\'t submit Empty question.','error');
        }

    }
}