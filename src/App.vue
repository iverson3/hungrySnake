<template>
	<div id="app">
		
		<div class="map">
			<div v-for="(row,index) in map" :key="index" class="map-row">
				<div v-for="(col,indexs) in row" :key="indexs" 
				:class="col === 0?'':'snake'"
				class="item">{{ col }}</div>
			</div>
		</div>
		<div class="controll">
			<span @click="startGame" class="button">开始游戏</span>
			<span @click="stopGame" class="button">暂停游戏</span>
			<div class="directory">
				<div class="top" @click="changeDirection(1)">上</div>
				<div class="center-row">
					<div class="left" @click="changeDirection(3)">左</div>
					<div class="right" @click="changeDirection(4)">右</div>
				</div>
				<div class="bottom" @click="changeDirection(2)">下</div>
			</div>
		</div>
		
	</div>
</template>

<script>
import Vue from 'vue'

export default {
	name: 'app',
	data() {
		return {
			// 棋盘 默认出发点是 [0][0]
			map: [
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			// 蛇的运动方向  上1 下2 左3 右4
			direction: 4,
			// 蛇身体所包含所有的map坐标(按顺序)
			snake: [
				{x: 0, y: 0}
			],
			
			head: [0,0], // 蛇头坐标
			foot: [0,0], // 蛇尾坐标
			over: false,
			
			// 食物的坐标
			food: null,
			
			// 定时器对象
			interval: null,
		}
	},
	computed: {
		// 剩余的可以移动或出现食物的map坐标集合
		left() {
			let res = [];
			for (let i = 0; i <= this.mapHeight; i++) {
				for (let j = 0; j <= this.mapWidth; j++) {
					if (this.map[i][j] === 0) {
						res.push({x: i, y: j})
					}
				}
			}
			return res;
		},
		mapWidth() {
			return this.map[0].length - 1;
		},
		mapHeight() {
			return this.map.length - 1;
		},
	},
	watch: {
		// 检测游戏是否结束
		over(newVal, oldVal) {
			if (newVal) {
				clearInterval(this.interval)
				alert('游戏结束')
			}
		}
	},
	methods: {
		changeDirection: function(val) {
			val = parseInt(val)
			// 不允许改变当前方向为相反的方向
			if ((this.direction === 1 || this.direction === 2) && (val === 1 || val === 2)) return
			if ((this.direction === 3 || this.direction === 4) && (val === 3 || val === 4)) return
			this.direction = val
		},
		startGame: function() {
			this.interval = setInterval(() => {
				let x = this.head[0]
				let y = this.head[1]
				
				// 向右移动
				if (this.direction === 4) {
					
					// 超出数组下标(蛇头撞墙) 则游戏结束
					if (y + 1 > this.mapWidth || this.map[x][y + 1] === 1) {
						this.over = true;
					} else if (this.food && x === this.food.x && y + 1 === this.food.y) {
						
						// 吃到食物
						// 修改蛇头坐标
						Vue.set(this.head, 1, y + 1);
						// 移动蛇头和蛇尾
						Vue.set(this.map[x], this.head[1], 1);
						this.snake.push({x: x, y: this.head[1]})
						
						this.food = null;
					} else {
						// 修改蛇头坐标
						Vue.set(this.head, 1, y + 1);
						// 移动蛇头和蛇尾
						Vue.set(this.map[x], this.head[1], 1);
						Vue.set(this.map[this.foot[0]], this.foot[1], 0);
						// 修改蛇的坐标集
						this.snake.splice(0, 1)
						this.snake.push({x: x, y: this.head[1]})
						// 修改蛇尾坐标 (需要知道前面蛇身的方向或位置坐标)
						Vue.set(this.foot, 0, this.snake[0].x);
						Vue.set(this.foot, 1, this.snake[0].y);
					}
					
					console.log('snake');
					console.log(this.snake);
				
				} // 向左移动
				else if (this.direction === 3  || this.map[x][y - 1] === 1) {
					
					// 超出数组下标(蛇头撞墙) 则游戏结束
					if (y === 0) {
						this.over = true;
					} else {
						Vue.set(this.head, 1, y - 1);
						Vue.set(this.map[x], y, 1);
						Vue.set(this.map[this.foot[0]], this.foot[1], 0);
						Vue.set(this.foot, 1, this.foot[1] - 1);
					}
					
				} // 向下移动
				else if (this.direction === 2  || this.map[x + 1][y] === 1) {
					
					// 超出数组下标(蛇头撞墙) 则游戏结束
					if (x + 1 > this.mapHeight) {
						this.over = true;
					} else {
						Vue.set(this.head, 0, x + 1);
						Vue.set(this.map[x], y, 1);
						Vue.set(this.map[this.foot[0]], this.foot[1], 0);
						Vue.set(this.foot, 0, this.foot[0] + 1);
					}
					
				} // 向上移动
 				else {
					// 超出数组下标(蛇头撞墙) 则游戏结束
					if (x === 0 || this.map[x - 1][y] === 1) {
						this.over = true;
					} else {
						Vue.set(this.head, 0, x - 1);
						Vue.set(this.map[x], y, 1);
						Vue.set(this.map[this.foot[0]], this.foot[1], 0);
						Vue.set(this.foot, 0, this.foot[0] - 1);
					}
				}
				
				console.log(this.snake);
				console.log(this.left);
				
				if (this.food === null) {
					// 随机生成食物
					this.food = {
						x: 0,
						y: 4
					}
				}
				
			}, 500)
		},
		stopGame: function() {
			clearInterval(this.interval)
		}
	}
};
</script>

<style>
	.map {
		flex: 1;
		border: 1px solid black;
		display: flex;
		flex-direction: column;
		width: -webkit-fit-content;
		height: auto;
	}
	.map-row {
		display: flex;
		flex-direction: row;
	}
	.item {
		width: 50px;
		height: 50px;
		background-color: #B2B2B2;
		border: 1px solid gray;
	}
	/* 蛇身体的样式 */
	.snake {
		background-color: orangered;
	}
	
	.controll {
		flex: 1;
	}
	.button {
		padding: 3px 5px;
		background-color: #516D7B;
		margin-right: 10px;
	}
	.directory {
		display: flex;
		flex-direction: column;
		width: -webkit-fit-content;
		padding: 30px;
	}
	.top {
		flex: 1;
		padding: 3px;
		background-color: gray;
		margin: 10px;
	}
	.center-row {
		flex: 1;
		display: flex;
		justify-content: space-between;
	}
	.center-row div {
		padding: 3px 10px;
		background-color: gray;
	}
	.left {
		margin-right: 20px;
	}
	.right {
		margin-left: 20px;
	}
	.bottom {
		flex: 1;
		padding: 3px;
		background-color: gray;
		margin: 10px;
	}
	
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
		display: flex;
		justify-content: center;
		align-content: center;
	}
</style>
