<template>
    <div class="flex1">
        <div class="flex2 flex3">
            <div class="flex4">4</div>
            <div class="flex4">5</div>
            <div class="flex4">6</div>
        </div>
        <div class="flex2">2</div>
     
        
        <div class="flex2">3</div>
       
    </div>    
</template>
<script>
export default {
    
}
</script>
<style>
    .flex1{
        width: 600px;
        height: 200px;
        background: #999999;
        margin: 0  auto;
        display: flex;
        flex-wrap:wrap-reverse;
    }
    .flex1 .flex2{
        width: 100px;
        height: 100px;
        background: #666666;
        margin: 0  auto;
        display: flex;
        align-items: center;
        justify-content: center;
        
    }
    .flex1 >div:nth-child(1){
        background: red;
    }
      .flex1 >div:nth-child(2){
        background:blue;
    }
      .flex1 >div:nth-child(3){
        background:yellow;
    }
    .flex1 .flex3{
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content:space-between;
    }
    .flex4{
        width: 100px;
        height: 50px;
        background: white;
    }
</style>
