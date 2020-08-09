module.exports = (connectionParams, webSocket) => {
  console.log("==========This is socket===============")
  console.log({ connectionParams, webSocket })
  console.log("=======================================")
  // if (connectionParams.authToken) {
  //   return validateToken(connectionParams.authToken)
  //     .then(findUser(connectionParams.authToken))
  //     .then(user => {
  //       return {
  //         currentUser: user,
  //       };
  //     });
  // }

  // throw new Error('Missing auth token!');
}
