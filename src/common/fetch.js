const javaApi = (data, callback) => {
    var url = '/dev';
    fetch(url, {
        method: 'POST',
        headers: {
            // 'Access-Control-Allow-Origin':'*',
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(responseJSON => {
            callback(responseJSON);
        })
        .catch(error => console.log('error is', error));
};

export { javaApi };
