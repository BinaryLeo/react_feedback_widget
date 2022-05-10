export interface FeedbackCreateData{
    type: string;
    comment: string;
    screenshot?: string;
}
export interface FeedbacksRepository{
    //* Methods for our repository to handle the Feedbacks 
    //*Which actions can the app do with the feedbacks in the database
create: (data:FeedbackCreateData)=> Promise<void>;
 
}