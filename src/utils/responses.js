export function Json(response, status, data) {
    response.writeHead(status, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(data));
}