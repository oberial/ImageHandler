<template>
    <div class="slide" ref="helloref"> 
            <div class="image">
                <span class="left" @click="up">&lt;</span>
                <transition v-for="item in slideImage" name="fade">
                    <img  :class="{'check':item.isChecked}" :src="item.src" v-show="item.isChecked">
                </transition>
                <span  class="right" @click="down">&gt;</span>
            </div>

            <div class="option">
                <span v-for="item in slideImage" :class="{'check':item.isChecked}" :key="item.name" @click="click(item,$event)"></span>    
            </div>
            <div>{{ this.$attrs.test }}</div>
    </div>
</template>


<script setup lang="ts">
import { inject, onMounted,ref, watch,getCurrentInstance,toRefs } from 'vue';
import { TEST_SYMBOL } from '../common/gloabl/gloable'
    type SlideImage = {
        name:string,
        src:string,
        isChecked?:boolean
    };

    interface Props {
        slideImage:Array<SlideImage>
    }

    const helloref=ref();

    const props= withDefaults(defineProps<Props>(),{
    slideImage: ()=> []
    });
    // const {slideImage} =props;

    const slideImage = ref(props.slideImage)
    const $Test1: (() => string) | undefined = inject(TEST_SYMBOL)

    onMounted(()=>{
        console.log(slideImage);
        console.log(props.slideImage);
        const { proxy }: any = getCurrentInstance()
        $Test1();
        proxy.$gloabletest();
        helloref.value.style='height:30%'
        slideImage.value.forEach((item,index)=>{
            index===0?item['isChecked']=true:item['isChecked']=false;
        })
    })

    watch(()=>props.slideImage,(newmsg,oldmsg)=>{
        console.log(newmsg);
        console.log(oldmsg);
    })

    // const {slideImage} = toRefs(props);
    function click(itemL:any,e:any) {
        console.log(props);
        console.log(slideImage.value);
        slideImage.value.forEach(item=> {
            if(item.name===itemL.name) {
                item.isChecked=true;
            } 
            else {
            item.isChecked=false;}
        })
    }

    function up(e:any) {
        let index = slideImage.value.findIndex((item)=>item.isChecked===true);
        if(index!==0) {
            slideImage.value[index].isChecked=false;
            slideImage.value[index-1].isChecked=true;
        }
    }

    function down(e:any) {
        let index = slideImage.value.findIndex((item)=>item.isChecked===true);
        if(index!==slideImage.value.length-1) {
            slideImage.value[index].isChecked=false;
            slideImage.value[index+1].isChecked=true;
        }
    }

</script>

<style scoped lang="scss">
    .slide {
        height: 200px;
        overflow: hidden;
        position:relative;
        padding: 10px;
    }

    .slide .image {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        span {
            border: none;
            font-size: xx-large;
            color:white;
            cursor: pointer;
        }

        .left {
            position: absolute;
            left:27%;
        }
        .right {
            position: absolute;
            right:27%;
        }
        img {
            object-fit:fill;
            height: 1000px;
            width:800px;
        }
    }
    .slide .option {
        padding: 10px 45%;
        display: grid;
        justify-items: center;
        align-items: center;
        grid-template-columns: repeat(4,1fr);
        column-gap: 10px;
    } 

    .slide .option span::before {
        content: "";
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color:rgb(63, 63, 60);
    }

    .slide .option span.check::before {
        display: block;
        content: "";
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: white;
    }

    .fade-enter-active, .fade-leave-active {
	    transition: opacity .25s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
        opacity: 0
    }
</style>