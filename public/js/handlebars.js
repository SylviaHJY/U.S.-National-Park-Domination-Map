let sub = $();
$('#sub').click(function(){
    let data = [];
    let string = null;
    let i = 0;
    while($('#'+i+' option:selected').val()!=undefined){
        string = $('#'+i+' option:selected').val();
        string=string.trim().replace(/["+]/g,"");
        data.push(string);
        i++;
    }
    console.info(data);
    $.ajax({
        url:"/updatepark",
        type:"POST",
        dataType:"JSON",
        data:{data},
        success:function (data) {
          console.log(data)
          // selss = data.data
        }
      })
});