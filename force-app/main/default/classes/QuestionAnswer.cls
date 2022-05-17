public class QuestionAnswer {
    
    @AuraEnabled(cacheable = true)
    public static List<Question__c> getQuestionAnswers(){
        return [SELECT Id,CreatedById, Description__c,Best_Answer__c, (SELECT Id,Name,Description__c,CreatedById,Question__c,Is_Best_Answer__c,Rating__c,Count_Vote__c FROM Answers__r order by Rating__c desc,createddate desc) FROM 
                Question__c];
    }
    
    @AuraEnabled
    public static void submitAnswer(Id questionId, String answer){
        Answer__c userAnswer = new Answer__c(Question__c = questionId,Name = answer,Description__c = answer); 
        insert userAnswer;
    }

    @AuraEnabled
    public static void submitBestAnswer(Id questionId, Id answer){
        Question__c bestQuestionAnswer = new Question__c(Id = questionId,Best_Answer__c = answer);        
        update bestQuestionAnswer;
        Answer__c bestAnswer = new Answer__c(Id = answer,Is_Best_Answer__c = true); 
        update bestAnswer;
    }
    
    @AuraEnabled
    public static void countVote(String voteType,Id answerId){
        Answer__c userAnswer = [SELECT Count_Vote__c FROM Answer__c WHERE ID = :answerId];
        if(voteType.equalsIgnoreCase('Upvote')){
            userAnswer.Count_Vote__c = userAnswer.Count_Vote__c + 1;
        }
        else{
            userAnswer.Count_Vote__c = userAnswer.Count_Vote__c - 1; 
        }
        update userAnswer;
    }    
}