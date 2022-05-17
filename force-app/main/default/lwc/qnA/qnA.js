import { LightningElement, track, wire } from 'lwc';
import allQuestions from '@salesforce/apex/QuestionAnswer.getQuestionAnswers';
import QUESTION_OBJECT from '@salesforce/schema/Question__c';
import DESCR_FIELD from '@salesforce/schema/Question__c.Description__c';
import NAME_FIELD from '@salesforce/schema/Question__c.Name';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class QnA extends LightningElement {

    @track allQuestionsAnswers;
    error;
    showModal = false;
    questionObject = QUESTION_OBJECT;
    myFields = [NAME_FIELD, DESCR_FIELD];
    listOfBadWords = ['Stupid','Idiot','Senseless'];
    @wire(allQuestions)
    allQuesnAnswers({data, error}){
        console.log('called ')
        if(data){
            console.log(data)
            this.allQuestionsAnswers = data
        }
        if(error){
            this.error = error
            console.error(error)
        }
    }

    handleNew(){
      this.showModal = true;
    }
    handleQuestionCreated(){
      this.showModal = false;
      location.reload();
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.showModal = false;
    }
    duplicateRecord(){
        this.showModal = false;
        this.showToastMessage('Duplicate','You can\'t submit duplicate question.','error');
    }

    showToastMessage(title,message,variant){
        const event = new ShowToastEvent({
            title : title,
            message : message,
            variant : variant
        });
        this.dispatchEvent(event);
    }
    handleSubmit(event){
        if(!event.detail.fields.Name || !event.detail.fields.Description__c){
            event.preventDefault();
            this.showModal = false;
            this.showToastMessage('Empty Question','You can\'t submit Empty question.','error');
        }
        else{            
            if (event.detail.fields.Name.split(' ').some(part => this.listOfBadWords.includes(part))) {
                event.preventDefault();
                 this.showModal = false;
                 this.showToastMessage('Bad Word','You can\'t enter bad word.','error');
                 return
            }
        }                 
    }
}