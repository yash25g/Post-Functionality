@isTest
public class QuestionAnswer_Test {
    
    @testSetup
    public static void testData(){
        Question__c question1 = new Question__c(Name = 'Test Question', Description__c = 'Test Question Description');
        insert question1;
                
    }
    @isTest
    public static void testMethod1(){
        Test.startTest();
        List<Question__c> questionList = QuestionAnswer.getQuestionAnswers();
        QuestionAnswer.submitAnswer(questionList[0].id,'Test Answer 2');
        Answer__c answer1 = [SELECT Id,Name,Is_Best_Answer__c,Count_Vote__c FROM Answer__c WHERE Description__c = 'Test Answer 2'];
        QuestionAnswer.submitBestAnswer(questionList[0].id,answer1.Id);        
        QuestionAnswer.countVote('Upvote',answer1.Id);
        Test.stopTest();
        answer1 = [SELECT Id,Name,Is_Best_Answer__c,Count_Vote__c FROM Answer__c WHERE Description__c = 'Test Answer 2'];
        System.assertEquals('Test Answer 2', answer1.Name);
        System.assertEquals(true, answer1.Is_Best_Answer__c);
        System.assertEquals(1, answer1.Count_Vote__c);
    }
    
    @isTest
    public static void testMethod2(){
        Question__c question1 = [SELECT Id FROM Question__c];
        Answer__c answer1 = new Answer__c(Name = 'Test Answer', Question__c = question1.Id, Description__c = 'Test Answer Description');
        insert answer1;
        Test.startTest();
        answer1.Count_Vote__c = 2;
        update answer1;
        answer1.Count_Vote__c = 4;
        update answer1;
        answer1.Count_Vote__c = 6;
        update answer1;
        Test.stopTest();
    }
}