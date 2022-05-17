import { api, LightningElement, wire } from 'lwc';
import submitAnswerApex from '@salesforce/apex/QuestionAnswer.submitAnswer';
import submitBestAnswer from '@salesforce/apex/QuestionAnswer.submitBestAnswer';
import doVote from '@salesforce/apex/QuestionAnswer.countVote';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LMSCHANNEL from '@salesforce/messageChannel/FirstLMSChannel__c';
import { publish,MessageContext } from 'lightning/messageService';
import AnswerSubmit from '@salesforce/label/c.AnswerSubmit';
import Answer_Exists from '@salesforce/label/c.Answer_Exists';
import Answer_Submit_Error from '@salesforce/label/c.Answer_Submit_Error';
import Not_Owner_Error from '@salesforce/label/c.Not_Owner_Error';

import Id from '@salesforce/user/Id';
export default class QuestionTile extends LightningElement {
    userId = Id;
    @api question={}
    userAnswer
    editQuestionModal = false;
    showModal = false;
    showBest = false;
    editAnswerModal = false;
    bestAnswer;
    editAnswerId;
    hasAnswer = true;
    userEnteredAnswer = true;
    connectedCallback(){
        console.log(this.question.Id);
        console.log('curre: '+this.userId);
        console.log('created user:'+this.question.CreatedById);
        if(this.question.Answers__r && this.userId == this.question.CreatedById){
            this.hasAnswer = false;
        }
    }
    get isOwner(){
      return !(this.userId == this.question.CreatedById);
    }
    handleNew(){
        this.showModal = true;
      }
      handleQuestionCreated(){
        this.showModal = false;
      }
      closeModal() {
          // to close modal set isModalOpen tarck value as false
          this.showModal = false;
      }

      captureValue(event){
          if(event.target.value){
            this.userEnteredAnswer = false;              
          } 
          else{
            this.userEnteredAnswer = true;  
          }       
          this.userAnswer = event.target.value;
      }
      submitAnswer(event){
          console.log(this.userAnswer);
          //console.log(this.question.Id);
          console.log(event.target.name);
          submitAnswerApex({ 
            questionId : event.target.name, 
            answer : this.userAnswer
        }).then(result => {
            this.showToastMessage('Answer created',AnswerSubmit,'success'); 
            this.showModal = false;
            location.reload();
        })
        .catch(error => {
            this.showToastMessage('Duplicate Answer',Answer_Exists,'error');             
            this.showModal = false;           
        });

      }

      editQuestion(event){
        this.editQuestionModal = true;
      }
      closeQuestion(){
        this.editQuestionModal = false;
      }
      handleSubmitQuestion(){
        this.editQuestionModal = false;
      }
      handleSuccess(event) {
        this.editQuestionModal = false;
        this.editAnswerModal = false;
        location.reload();
    }

    handleBest(){
        this.showBest = true;
    }
    closeBest(){
        this.showBest = false;
    }

    changeHandler(event){
        this.bestAnswer = event.target.value;
    }

    submitBest(){
        if(this.bestAnswer){
            console.log(this.bestAnswer);
            submitBestAnswer({ 
                questionId : this.question.Id, 
                answer : this.bestAnswer
            }).then(result => {
                this.showToastMessage('Answer created',AnswerSubmit,'success'); 
                this.showBest = false;
                location.reload();
            })
            .catch(error => {
                this.showToastMessage('Error',Answer_Submit_Error,'error'); 
                this.showBest = false;            
            });
        }
    }

    handleVote(event){
        doVote({ 
            voteType : event.target.title, 
            answerId : event.target.name
        }).then(result => {
            this.showToastMessage('Vote Recorded','Vote Recorded.','success'); 
            location.reload();
        })
        .catch(error => {
            this.showToastMessage('Error',Answer_Submit_Error,'error');           
        });
    }

    handleEditAnswer(event){
        this.editAnswerId = event.target.name;
        let answerCreate = event.target.id;
        answerCreate = answerCreate.substr(0, answerCreate.indexOf('-'));
        console.log(answerCreate);
        if(this.userId != answerCreate){
            this.showToastMessage('Not Owner',Not_Owner_Error,'error');
            return;
        }
        this.editAnswerModal = true;
    }

    closeAnswer(){
        this.editAnswerModal = false;
    }

    acessIssueError(){
        this.editAnswerModal = false;
        this.showToastMessage('Not Owner',Not_Owner_Error,'error');
    }

    handleSubmitAnswer(event){
        if(!event.detail.fields.Description__c){
            event.preventDefault();
            this.editAnswerModal = false;
            this.showToastMessage('Empty Answer','You can\'t submit Empty Answer.','error');
        }
    }

    showToastMessage(title,message,variant){
        const event = new ShowToastEvent({
            title : title,
            message : message,
            variant : variant
        });
        this.dispatchEvent(event);
    }

    //LMS Channel Use

    @wire(MessageContext) context    

    publishMessage(){
        console.log('Published');
        const message={
            lmsData:{
                value:this.question.Id
            },
        }
        //publish(messageContext, messageChannel, message)
        publish(this.context, LMSCHANNEL, message)
        console.log('Published1');
    }
}