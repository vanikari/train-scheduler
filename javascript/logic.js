$(document).ready(function () {

    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyADUu4YnGn6QNNvn1wqImj13IxveDe_2BA",
    authDomain: "train-scheduler-3d15d.firebaseapp.com",
    databaseURL: "https://train-scheduler-3d15d.firebaseio.com",
    projectId: "train-scheduler-3d15d",
    storageBucket: "train-scheduler-3d15d.appspot.com",
    messagingSenderId: "565303097580"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

    const submit = $('#submit');

    function clearInputs() {
        $(".form-control").val("");
    }

    //functionality on clicking the submit button
    submit.on('click', function () {
        event.preventDefault();


        var newTrain = $("#train").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrainTime = $("#train-time").val().trim();
        var frequency = $("#frequency").val().trim();
        console.log(newTrain);

        database.ref().push({
            train: newTrain,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        
        clearInputs();

    });


    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        

        var trainName = childSnapshot.val().train;
        var trainDestination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().firstTrainTime;
        var trainFrequency = childSnapshot.val().frequency;
        var currentTime = moment()
       
        var timeArr = firstTrain.split(":");
        var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
        console.log(trainTime)


        while (moment.max(currentTime, trainTime) === currentTime) {
            trainTime = trainTime.add(trainFrequency, "minutes");
        } 
        
        minutesAway = trainTime.diff(currentTime, "minutes")
        tArrival = trainTime.format("hh:mm A");

        var newRow = $("<tr>").addClass("employee-row");
        var colTrain = $("<td>").text(trainName);
        var colDest = $("<td>").text(trainDestination);
        var colTrainTime = $("<td>").text(tArrival);
        var colFrequency = $("<td>").text(trainFrequency);
        var colMinutesAway = $("<td>").text(minutesAway);

        $("#table-body").append(newRow).append(colTrain, colDest,  colFrequency, colTrainTime, colMinutesAway);
        
    }); 
    
})