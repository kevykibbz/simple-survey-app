const endpoints={
    "options":{
        "production":"https://opinion-harbor-6c2c204c10f4.herokuapp.com/api/options",
        "development":"http://127.0.0.1:8000/api/options",
        
    },
    "responses":{
        "production":"https://opinion-harbor-6c2c204c10f4.herokuapp.com/api/questions/responses",
        "development":"http://127.0.0.1:8000/api/questions/responses",
    },
    "questions":{
        "production":"https://opinion-harbor-6c2c204c10f4.herokuapp.com/api/questions",
        "development":"http://127.0.0.1:8000/api/questions",
    },
    "certificates":{
        "production":"https://opinion-harbor-6c2c204c10f4.herokuapp.com/api/questions/certificates",
        "development":"http://127.0.0.1:8000/api/questions/certificates",
    },
    "download":{
        "production":"https://opinion-harbor-6c2c204c10f4.herokuapp.com/api/questions/responses/certificates",
        "development":"http://127.0.0.1:8000/api/questions/responses/certificates"
    }
}
export default endpoints