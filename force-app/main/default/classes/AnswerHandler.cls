public class AnswerHandler extends TriggerHandler {
    public override void afterUpdate(){
        
    }
    public override void beforeUpdate(){
        checkRating((List<Answer__c>) newList);
    }
    public override void afterInsert(){
        
    }
    public override void beforeInsert(){
        
    }
   //---------------------------------------------------------------------------------------------------------------//
   
    public static void checkRating(List<Answer__c> newAnswers){
        for(Answer__c eachAnswer : newAnswers){
            if(eachAnswer.Is_Best_Answer__c){
                eachAnswer.Rating__c = 3;
            }
            else if(eachAnswer.Count_Vote__c <= 0 ){
                eachAnswer.Rating__c = 0;                
            }
            else if(eachAnswer.Count_Vote__c < 3){
                eachAnswer.Rating__c = 1;                
            }
            else if(eachAnswer.Count_Vote__c < 5){
                eachAnswer.Rating__c = 2;                
            }
            else{
                eachAnswer.Rating__c = 3;  
            }
        }
    } 
}