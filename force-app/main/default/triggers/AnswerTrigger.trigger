trigger AnswerTrigger on Answer__c (before insert, before update, after insert, after update) {
    if (Utility.checktriggeractive('AnswerTrigger')) {
        new AnswerHandler().execute('Answer__c');
    }
}