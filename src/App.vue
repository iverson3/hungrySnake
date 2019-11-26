<template>
	<div id="app">
		
		<div class="map-contaner">
			<div class="map">
				<div v-for="(row,index) in map" :key="index" class="map-row">
					<div v-for="(col,indexs) in row" :key="indexs" 
					:class="(headP.x === index && headP.y === indexs)? 'snake-head' : ((col === 1) || (food && index === food.x && indexs === food.y)? 'snake':'')"
					class="item"></div>
				</div>
			</div>
		</div>
		<div class="controll">
			<div class="tools">
				<span @click="startGame" class="button">开始游戏</span>
				<span @click="stopGame" class="button">暂停游戏</span>
				<span @click="restartGame" class="button">重新开始</span>
			</div>
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
// import touchEvent from './helper/touchEvent.js'
// @tap="swipe2left(x)" @swipeup="changeDirection(1)" @swipeleft="changeDirection(3)" @swiperight="changeDirection(4)" @swipedown="changeDirection(2)"

export default {
	name: 'app',
	data() {
		return {
			// 棋盘 默认出发点是 [0][0]
			map: [
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			// 蛇的运动方向  上1 下2 左3 右4
			direction: 4,
			// 蛇身体所包含所有的map坐标(按顺序)
			snake: [
				{x: 0, y: 0}
			],
			head: [0,0], // 蛇头坐标
			foot: [0,0], // 蛇尾坐标
			over: false, // 游戏是否结束
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
		// 蛇头坐标
		headP() {
			return this.snake[this.snake.length - 1]
		}
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
	mounted: function() {	
		
	},
	methods: {
		swipe2left: function(x) {
			console.log('swipe2left');
		},
		changeDirection: function(val) {
			val = parseInt(val)
			// 不允许改变当前方向为相反的方向
			if ((this.direction === 1 || this.direction === 2) && (val === 1 || val === 2)) return
			if ((this.direction === 3 || this.direction === 4) && (val === 3 || val === 4)) return
			this.direction = val
		},
		// 随机生成food
		randomFood: function() {
			if (this.food === null) {
				let len = this.left.length
				// 生成从0到len-1之间的随机数
				let index = parseInt(Math.random() * ( len + 1 ), 10)
				
				console.log('len:');
				console.log(len);
				console.log(index);
				
				// 随机生成食物
				this.food = {
					x: this.left[index].x,
					y: this.left[index].y
				}
			}
		},
		startGame: function() {
			if (this.interval !== null) return
			
			this.interval = setInterval(() => {
				let x = this.head[0]
				let y = this.head[1]
				
				// 随机生成食物
				this.randomFood()
				
				// 向右移动
				if (this.direction === 4) {
					// 蛇头撞墙或撞蛇身(超出数组下标) 则游戏结束
					if (y + 1 > this.mapWidth || this.map[x][y + 1] === 1) {
						this.over = true;
					} // 吃到食物
					else if (this.food && x === this.food.x && y + 1 === this.food.y) {
						// 修改蛇头坐标
						Vue.set(this.head, 1, y + 1);
						// 移动蛇头(不需要移动蛇尾)
						Vue.set(this.map[x], this.head[1], 1);
						// 蛇身增加一个长度
						this.snake.push({x: x, y: this.head[1]})
						this.food = null;
					} // 正常移动
					else {
						// 修改蛇头坐标
						Vue.set(this.head, 1, y + 1);
						// 移动蛇头和蛇尾
						Vue.set(this.map[x], this.head[1], 1);
						Vue.set(this.map[this.foot[0]], this.foot[1], 0);
						// 修改蛇的坐标集
						this.snake.splice(0, 1)
						this.snake.push({x: x, y: this.head[1]})
						// 修改蛇尾坐标
						Vue.set(this.foot, 0, this.snake[0].x);
						Vue.set(this.foot, 1, this.snake[0].y);
					}
					
					console.log('snake');
					console.log(this.snake);
				
				} // 向左移动
				else if (this.direction === 3) {
					
					// 超出数组下标(蛇头撞墙) 则游戏结束
					if (y === 0 || this.map[x][y - 1] === 1) {
						this.over = true;
					} else if (this.food && x === this.food.x && y - 1 === this.food.y) {
						
						// 吃到食物
						// 修改蛇头坐标
						Vue.set(this.head, 1, y - 1);
						// 移动蛇头
						Vue.set(this.map[x], this.head[1], 1);
						this.snake.push({x: x, y: this.head[1]})
						
						this.food = null;
					} else {
						Vue.set(this.head, 1, y - 1);
						Vue.set(this.map[x], this.head[1], 1);
						Vue.set(this.map[this.foot[0]], this.foot[1], 0);
						// 修改蛇的坐标集
						this.snake.splice(0, 1)
						this.snake.push({x: x, y: this.head[1]})
						// 修改蛇尾坐标 (需要知道前面蛇身的方向或位置坐标)
						Vue.set(this.foot, 0, this.snake[0].x);
						Vue.set(this.foot, 1, this.snake[0].y);
					}
					
				} // 向下移动
				else if (this.direction === 2) {
					
					// 超出数组下标(蛇头撞墙) 则游戏结束
					if (x + 1 > this.mapHeight || this.map[x + 1][y] === 1) {
						this.over = true;
					} else if (this.food && x + 1 === this.food.x && y === this.food.y) {
						
						// 吃到食物
						// 修改蛇头坐标
						Vue.set(this.head, 0, x + 1);
						// 移动蛇头
						Vue.set(this.map[this.head[0]], y, 1);
						this.snake.push({x: this.head[0], y: y})
						
						this.food = null;
					} else {
						Vue.set(this.head, 0, x + 1);
						Vue.set(this.map[this.head[0]], y, 1);
						Vue.set(this.map[this.foot[0]], this.foot[1], 0);
						// 修改蛇的坐标集
						this.snake.splice(0, 1)
						this.snake.push({x: this.head[0], y: y})
						// 修改蛇尾坐标 (需要知道前面蛇身的方向或位置坐标)
						Vue.set(this.foot, 0, this.snake[0].x);
						Vue.set(this.foot, 1, this.snake[0].y);
					}
					
				} // 向上移动
 				else {
					// 超出数组下标(蛇头撞墙) 则游戏结束
					if (x === 0 || this.map[x - 1][y] === 1) {
						this.over = true;
					} else if (this.food && x - 1 === this.food.x && y === this.food.y) {
						
						// 吃到食物
						// 修改蛇头坐标
						Vue.set(this.head, 0, x - 1);
						// 移动蛇头
						Vue.set(this.map[this.head[0]], y, 1);
						this.snake.push({x: this.head[0], y: y})
						
						this.food = null;
					} else {
						Vue.set(this.head, 0, x - 1);
						Vue.set(this.map[this.head[0]], y, 1);
						Vue.set(this.map[this.foot[0]], this.foot[1], 0);
						// 修改蛇的坐标集
						this.snake.splice(0, 1)
						this.snake.push({x: this.head[0], y: y})
						// 修改蛇尾坐标 (需要知道前面蛇身的方向或位置坐标)
						Vue.set(this.foot, 0, this.snake[0].x);
						Vue.set(this.foot, 1, this.snake[0].y);
					}
				}
				
				console.log(this.snake);
				console.log(this.left);
				
			}, 500)
		},
		stopGame: function() {
			clearInterval(this.interval)
			this.interval = null;
		},
		restartGame: function() {
			this.over = false
			this.snake = [{x: 0, y: 0}]
			this.food = null
			this.direction = 4
			this.head = [0,0]
			this.foot = [0,0]
			clearInterval(this.interval)
			this.interval = null;
			
			this.map = [
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			];
			this.startGame()
		}
	}
};
</script>

<style>
	.map-contaner {
		flex: 1;
		display: flex;
		justify-content: center;
		align-content: center;
		height: auto;
	}
	.map {
		display: flex;
		flex-direction: column;
		height: auto;
		background-color: black;
	}
	.map-row {
		display: flex;
		flex-direction: row;
	}
	.item {
		width: 26px;
		height: 26px;
		border: 1px solid gray;
	}
	/* 蛇身体的样式 */
	.snake {
		background-color: seagreen;
	}
	/* 蛇头的样式 */
	.snake-head {
		border-radius: 13px;
		background-color: seagreen;
	}
	
	.controll {
		flex: 1;
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}
	.tools {
		flex: 1;
		display: flex;
		justify-content: space-around;
		align-content: center;
	}
	.button {
		padding: 8px 16px;
		color: white;
		background-color: gray;
		font-size: 18px;
	}
	.directory {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-content: center;
		justify-content: center;
		padding: 65px;
		padding-top: 20px;
		padding-bottom: 0px;
		clear: both;
		font-size: 20px;
		color: white;
	}
	.top {
		flex: 1;
		padding: 15px;
		background-color: gray;
		margin: 10px;
	}
	.center-row {
		flex: 1;
		display: flex;
		justify-content: space-between;
	}
	.center-row div {
		padding: 15px 46px;
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
		padding: 15px;
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
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}
</style>
