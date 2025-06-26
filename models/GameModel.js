export default class GameModel {
    constructor(board, status, players, winner, invated, host, turn) {
      this.board = board;
      this.status = status;
      this.players = players;
      this.winner = winner;
      this.invated = invated;
      this.host = host;
      this.turn = turn;
      this.createdAt = new Date().toISOString();
    }
  }

  //0- waiting 1-active 2-passive
  