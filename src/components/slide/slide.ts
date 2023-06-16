import { ref, h,Transition,onMounted,defineComponent, render } from "vue";
import './slide.scss'

type SlideImage = {
    name:string,
    src:string,
    isChecked?:boolean
};

interface Props {
    slideImage:Array<SlideImage>
}
export default defineComponent({
    props:['slideImage'],

    setup(props:Props) {
        const helloref=ref<HTMLUListElement>();

        onMounted(()=>{
            console.log(helloref);
            // helloref.value.style='height:100%'
            refImage.value.forEach((item,index)=>{
                index===0?item['isChecked']=true:item['isChecked']=false;
            })
        })
        
        const refImage = ref(props.slideImage)

        function click(itemL:any,e:any) {
            alert('click');
        }
        
        function up(e:any) {
            let index = refImage.value.findIndex((item)=>item.isChecked===true);
            if(index!==0) {
                refImage.value[index].isChecked=false;
                refImage.value[index-1].isChecked=true;
            }
        }

        function down(e:any) {
            let index = refImage.value.findIndex((item)=>item.isChecked===true);
            if(index!==refImage.value.length-1) {
                refImage.value[index].isChecked=false;
                refImage.value[index+1].isChecked=true;
            }
        }
        return {
            refImage,
            click,
            up,
            down
        }
    },

    render() {
        const {
            refImage,
            click,
            up,
            down
          } = this
        return h('div',{class:'slide',ref:'helloref'},
            
            [h('div',{class:'image'},[
                h('span',{class:'left',onClick: up},'>'),
                refImage.map(({isChecked,name,src})=>{
                    return h(Transition,{name:'fade'},h('img',{class:{'check':isChecked},src:src ,style:{'display':isChecked?'block':'none'}}))
                }),
                h('span',{class:'right',onClick: down},'<')
            ]),
            
            h('div',{class:'option'},
                refImage.map(({isChecked,name})=>{
                    return h('span',{class:{'check':isChecked},key:name,onClick:click})
                })
            )])
    }
})