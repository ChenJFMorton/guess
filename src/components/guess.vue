
<script type="text/javascript">
import usstAbi from "../abi/USST";
import guscAbi from "../abi/GUSC";
import guessVoteAbi from "../abi/GuessVote";
import createKeccakHash from "keccak";

export default {
  data() {
    return {
      usstAmount: "",
      period: "",
      newestBlockNum: "",
      state: "",
      stateDesc: "",
      accounts: [],
      account: "",
      usstBalance: 0,
      guscBalance: 0,
      usstContract: "",
      guscContract: "",
      guessVoteContract: "",
      voteAmount: "",
      radio: "1",
      web3: "",
      loadingStatus: false,
      chargeDisabled: true,
      chargeLoadingStatus: false,
      tableData: [],
      voteDisabled: false,
      voteLoadingStatus: false,
    };
  },
  created() {
    this.init();
    this.handleNewAccounts();

    // 定时轮训状态
    setInterval(() => {
      this.linkWallet();
    }, 2000);
    // setInterval(() => {
    // this.generateVoteResult();
    // this.sendAwards();
    // }, 10000);
    // this.generateVoteResult();
    // this.sendAwards();
  },
  methods: {
    init: async function () {
      const Web3 = require("web3");
      web3 = new Web3(window.ethereum);

      /**
       * testnet
       */
      // usst合约
      this.usstContract = new web3.eth.Contract(
        usstAbi,
        "0xD6C850aeBFDC46D7F4c207e445cC0d6B0919BDBe"
      );
      // gusc合约
      this.guscContract = new web3.eth.Contract(
        guscAbi,
        "0x1d80315fac6aBd3EfeEbE97dEc44461ba7556160"
      );
      // guessVote合约
      this.guessVoteContract = new web3.eth.Contract(
        guessVoteAbi,
        "0x79811ED0d00AC04cFA75A4D1f51ec5bcE7FaeD84"
      );
      // /**
      //  * local
      //  */
      // // usst合约
      // this.usstContract = new web3.eth.Contract(
      //   usstAbi,
      //   "0xc6e2AD42e82d7c59c69Fc9aBbc5F0feb6209bE45"
      // );
      // // gusc合约
      // this.guscContract = new web3.eth.Contract(
      //   guscAbi,
      //   "0x2455f09186298a5Fb7545C1260D7Ab8f4D7998D8"
      // );
      // // guessVote合约
      // this.guessVoteContract = new web3.eth.Contract(
      //   guessVoteAbi,
      //   "0x511C2472AD74Efa84D6CfA512bdb9d1E48EF9622"
      // );
    },
    linkWallet: async function () {
      try {
        this.newestBlockNum = parseInt(
          await ethereum.request({
            method: "eth_blockNumber",
            params: [],
          }),
          16
        );
        // 20块一期
        this.period = Math.ceil(this.newestBlockNum / 20);
        // 每20块中前10块为“投注中”，后10块为“已截止”
        const _cc = this.newestBlockNum % 20;
        if (_cc > 0 && _cc <= 10) {
          this.state = 0;
          this.stateDesc = "投注中";
        } else {
          this.state = 1;
          this.stateDesc = "已截止";
        }

        this.usstBalance = await this.usstContract.methods
          .balanceOf(this.account)
          .call();

        this.guscBalance = await this.guscContract.methods
          .balanceOf(this.account)
          .call();

        this.queryVoteListByAddress();
        // this.generateVoteResult();
        // this.sendAwards();
      } catch (error) {
        console.error(error);
      }
    },
    toChecksumAddress: function (address) {
      address = address.toLowerCase().replace("0x", "");
      var hash = createKeccakHash("keccak256").update(address).digest("hex");
      var ret = "0x";

      for (var i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
          ret += address[i].toUpperCase();
        } else {
          ret += address[i];
        }
      }

      return ret;
    },
    handleNewAccounts: async function () {
      this.accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (this.isMetaMaskConnected()) {
        this.account = this.accounts[0];
      }
    },
    // 准许充值
    approve: async function () {
      this.loadingStatus = true;
      await this.usstContract.methods
        .approve(this.guscContract._address, this.usstAmount)
        .send({
          from: this.account,
        })
        .on("error", function (error) {
          console.log(11);
          this.loadingStatus = false;
        })
        .on("transactionHash", function (transactionHash) {
          console.log(22);
        })
        .on("receipt", function (receipt) {
          console.log(33);
          console.log(receipt.contractAddress); // 合约地址内容;
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(44);
          this.loadingStatus = false;
        })
        .then(function (newContractInstance) {
          console.log(66);
          console.log(newContractInstance); //合约地址实例
        });
      this.chargeDisabled = false;
      this.loadingStatus = false;
    },
    // 充值
    charge: async function () {
      this.chargeLoadingStatus = true;
      await this.guscContract.methods.mintByUsst(this.usstAmount).send({
        from: this.account,
        // gasPrice: web3.utils.toWei("0.002", "ether"),
        // gasPrice: 8,
        // gasLimit:8000000,
      });
      this.chargeLoadingStatus = false;
      this.chargeDisabled = false;
    },
    // 生成竞猜结果
    generateVoteResult: async function () {
      await this.guessVoteContract.methods.generateVoteResult().send({
        from: this.account,
      });
    },
    // 派奖
    sendAwards: function () {
      this.guessVoteContract.methods
        .sendAwards({
          _periodNum: 938,
          _amount: 3,
          _voteResult: 0,
          _isHandled: false,
        })
        .send({
          from: this.account,
        })
        .then(console.log);
    },
    // 派奖
    randomCount: function () {
      this.guessVoteContract.methods.randomCount().call().then(console.log);
    },
    isMetaMaskConnected: function () {
      return this.accounts && this.accounts.length > 0;
    },
    // 投注
    voteGuess: async function () {
      if (this.state == 1) {
        alert("已截止");
        return;
      }
      // this.voteDisabled = true;
      // this.voteLoadingStatus = true;
      // 准许扣钱
      await this.guscContract.methods
        .approve(this.guessVoteContract._address, this.voteAmount)
        .send({
          from: this.account,
        });
      await this.guessVoteContract.methods
        .voteGuess(this.radio, this.voteAmount)
        .send({
          from: this.account,
        })
        // .then((result) => {
        //   this.setTableData(result);
        // })
        .on("error", function (error) {
          console.log(11);
          this.voteDisabled = false;
          this.voteLoadingStatus = false;
        })
        .on("transactionHash", function (transactionHash) {
          console.log(22);
        })
        .on("receipt", function (receipt) {
          console.log(33);
          console.log(receipt.contractAddress); // 合约地址内容;
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(44);
        })
        .then(function (newContractInstance) {
          console.log(66);
          console.log(newContractInstance); //合约地址实例
        });
      // 扣钱
      // await this.guscContract.methods
      //   .transfer(this.guscContract._address, this.voteAmount)
      //   .send({ from: this.account });
    },
    // 获取我的投注情况
    queryVoteListByAddress: async function () {
      this.guessVoteContract.methods
        .queryVoteListByAddress()
        .call({ from: this.account })
        .then((result) => {
          this.setTableData(result);
        })
        .catch((e) => {
          console.warn(e);
        });
    },
    setTableData: function (result) {
      // 初始化清空
      this.tableData = [];
      // 期数集合
      for (let i = 0; i < result.length; i++) {
        this.tableData.push({
          voteId: result[i]._voteId,
          period: result[i]._periodNum,
          voteAmount: result[i]._amount,
          vote: result[i]._vote == "0" ? "小" : "大",
          voteResult:
            result[i]._result == "0"
              ? "小"
              : result[i]._result == "1"
              ? "大"
              : "未开奖",
          win: result[i]._winAmount,
        });
      }
    },
  },
};
</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6"><div class="grid-content"></div></el-col>
      <el-col :span="6"><div class="grid-content"></div></el-col>
      <el-col :span="3"
        ><div class="grid-content">
          <!-- <button type="submit" id="connectButton" @click="linkWallet()">
            刷新账号信息
          </button> -->
        </div></el-col
      >
      <el-col :span="9"
        ><div class="grid-content">账号:{{ account }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="2"><div class="grid-content"></div></el-col>
      <el-col :span="18"
        ><div class="grid-content">
          当前期数:{{ period }} {{ stateDesc }}
        </div></el-col
      >
      <el-col :span="2"><div class="grid-content"></div></el-col>
      <el-col :span="2"><div class="grid-content"></div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="2"><div class="grid-content"></div></el-col>
      <el-col :span="18"
        ><div class="grid-content">
          当前最新区块:{{ newestBlockNum }}
        </div></el-col
      >
      <el-col :span="2"><div class="grid-content"></div></el-col>
      <el-col :span="2"><div class="grid-content"></div></el-col>
    </el-row>

    <el-row :gutter="50">
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <div class="grid-content">USST余额:{{ usstBalance }}</div>
          <div class="grid-content">GUSC余额:{{ guscBalance }}</div>
          <div>充值USST（充值USST获取GUSC）</div>
          <el-input
            v-model="usstAmount"
            placeholder="请输入要充值USST数量"
          ></el-input>
          <el-button @click="approve()" :loading="loadingStatus">
            Approve / 确认
          </el-button>
          <el-button
            @click="charge()"
            :loading="chargeLoadingStatus"
            :disabled="chargeDisabled"
            >充值</el-button
          >
        </div></el-col
      >
      <!-- <el-col :span="1"><div class="grid-content"></div></el-col> -->
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <div>投注（猜大小来获取GUSC）</div>
          <div>当前期数:{{ period }}</div>
          <template>
            <el-radio v-model="radio" label="1">大</el-radio>
            <el-radio v-model="radio" label="0">小</el-radio>
          </template>
          <el-input v-model="voteAmount" placeholder="投注数量"></el-input>
          <el-button
            @click="voteGuess()"
            :loading="voteLoadingStatus"
            :disabled="voteDisabled"
            >投注</el-button
          >
        </div></el-col
      >
      <!-- <el-col :span="1"><div class="grid-content"></div></el-col> -->
      <el-col :span="12"
        ><div class="grid-content bg-purple">
          <div>我的投注</div>
          <template>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="voteId" label="投注id" width="100">
              </el-table-column>
              <el-table-column prop="period" label="期数" width="100">
              </el-table-column>
              <el-table-column prop="voteAmount" label="投注数量" width="100">
              </el-table-column>
              <el-table-column prop="vote" label="投注目标" width="100">
              </el-table-column>
              <el-table-column prop="voteResult" label="开奖结果" width="100">
              </el-table-column>
              <el-table-column prop="win" label="赢取数量"> </el-table-column>
            </el-table>
          </template></div
      ></el-col>
    </el-row>
  </div>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>