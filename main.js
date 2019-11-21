$(function(){

    
    var currentDate; // Holds the day clicked when adding a new event
    var currentEvent; // Holds the event object when editing an event
    
    
    
    
    $('#color').colorpicker(); // Colopicker
    
    
    

    var base_url='http://localhost:8080/helpaluno/index.php/'; // Here i define the base_url

    // Fullcalendar
    $('#calendar').fullCalendar({
        locale: 'pt-br',

        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
        'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro',
        'Novembro', 'Dezembro'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua',
        'Qui', 'Sex', 'Sab'],
        header: {
            left: 'prev, next, today',
            center: 'title',
            right: 'month, basicWeek, basicDay'
        },
        // Get all events stored in database
        defaultDate: new Date(),
        
        
        eventLimit: true, // allow "more" link when too many events
        events: base_url+'calendar/getEvents',
        
        //ADD LINHA ABAIXO
       // evento: base_url+'alunos/getAluno',
        

        selectable: true,
        selectHelper: true,
        editable: true, // Make the event resizable true           
            select: function(start, end) {
               
                
                
                
                $('#start').val(moment(start).format('YYYY-MM-DD HH:mm:ss'));
                $('#end').val(moment(end).format('YYYY-MM-DD HH:mm:ss'));
                
                // Open modal to add event
                modal({
                    // Available buttons when adding
                    buttons: {
                        add: {
                            id: 'add-event', // Buttons id
                            css: 'btn-success', // Buttons class
                            label: 'Adicionar' // Buttons label
                        }
                    },
                    title: 'Criar Evento', // Modal title
                    event: {
                    
                        start : moment(start).format('DD/MM/YYYY HH:mm'),
                        end : moment(start).format('DD/MM/YYYY HH:mm')
                    }

                    
                });
            
            
           
            }, 

        

            //----------------------------------------------------------------------------------------
           
         eventDrop: function(event, delta, revertFunc,start,end) {  
            
            //Este, é quando arrasto o evento para outra data
           

            start = event.start.format('YYYY-MM-DD HH:mm:ss');
            
            if(event.end){
            
                end = event.end.format('YYYY-MM-DD HH:mm:ss');
            
            }else{
                end = start;
            }        
                       
               $.post(base_url+'calendar/dragUpdateEvent',{                            
                id:event.id,
                start : start,
                end : start
            }, function(result){
                $('.alert').addClass('alert-success').text('Evento alterado com sucesso');
                hide_notify();


            });
        },

        

        //----------------------------------------------------------------------------------------

          eventResize: function(event,dayDelta,minuteDelta,revertFunc) { 

            

            start = event.start.format('YYYY-MM-DD HH:mm:ss');
            if(event.end){
                end = event.end.format('YYYY-MM-DD HH:mm:ss');
            }else{
                end = start;
            }         
                    
                $.post(base_url+'calendar/dragUpdateEvent',{                            
                    id:event.id,
                    start : start,
                    end : start
                }, function(result){
                    $('.alert').addClass('alert-success').text('Evento alterado com sucesso');
                    hide_notify();

                });
            },
          
        // Event Mouseover
        eventMouseover: function(calEvent, jsEvent, view){

            // ----------------- ADICIONEI ISSO, DAQUI
            
         /*   var durationTime = moment(calEvent.start).format('HH') + ":" + moment(calEvent.start).format('mm') + " - " + moment(calEvent.end).format('HH') + ":" + moment(calEvent.end).format('mm')
            var tooltip = '<div class="tooltipevent" style="width:100px; height:20px; position:absolute;z-index:1000;">' + durationTime + '</div>'; */

            // ----------------- ATÉ AQUI E COMENTEI A DEBAIXO QUE TINHA..
            
                    var tooltip = '<div class="event-tooltip">' + calEvent.description + '</div>'; //COMENTEI ISSO
           
           
           
            $("body").append(tooltip);

            $(this).mouseover(function(e) {
                $(this).css('z-index', 10000);
                $('.event-tooltip').fadeIn('500');
                $('.event-tooltip').fadeTo('10', 1.9);
            }).mousemove(function(e) {
                $('.event-tooltip').css('top', e.pageY + 10);
                $('.event-tooltip').css('left', e.pageX + 20);
            });
        },
        
        eventMouseout: function(calEvent, jsEvent) {
            $(this).css('z-index', 8);
            $('.event-tooltip').remove();
        },
        
        // Handle Existing Event Click
        eventClick: function(calEvent, jsEvent, view) {
            // Set currentEvent variable according to the event clicked in the calendar
            
            
         //   console.log(calEvent);
            
            currentEvent = calEvent;
            
            currentEvent.start =  moment(currentEvent.start ).format('DD/MM/YYYY HH:mm');
            currentEvent.end = moment(currentEvent.end) ? moment(currentEvent.end ).format('DD/MM/YYYY HH:mm') :  moment(currentEvent.start ).format('DD/MM/YYYY HH:mm'); // SERVE PARA AJUSTAR A FORMATAÇÃO DA DATA
            

            // Open modal to edit or delete event
            modal({
                // Available buttons when editing
                buttons: {
                    delete: {
                        id: 'delete-event',
                        css: 'btn-danger',
                        label: 'Deletar'
                    },
                    update: {
                        id: 'update-event',
                        css: 'btn-success',
                        label: 'Alterar'
                    }
                },
                title: 'Editar Evento "' + calEvent.title + '"',
                event: calEvent
                
                
            });
           
            
        }

    });

    
    //calendar.setOption('locale', 'pt-br');

    // Prepares the modal window according to data passed
    function modal(data) {
       
        
        idusuario = (data.event ? data.event.alunos_idalunos : '');
        
       // idatendimento = (data.event ? data.event.alunos_idalunos : '');
       // console.log(idusuario);

            $.ajax({
                type: "get",
                url: "/helpaluno/index.php/alunos/indexjson",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (obj) {
                //  console.log(idusuario);
                    
                    if (obj != null) {
                        var data = obj.alunos;
                        var selectbox = $('#alunos_idalunos');
                        selectbox.find('option').remove();
                        $.each(data, function (i, d) {
                            if(idusuario==d.idalunos){
                            
                                $('<option>').val(d.idalunos).text(d.nome).appendTo(selectbox).attr('selected','selected');
                            }else{
                                $('<option>').val(d.idalunos).text(d.nome).appendTo(selectbox);
                            }
                        });
                    }
                }
            });

            
        
        // Set modal title
        $('.modal-title').html(data.title);
        // Clear buttons except Cancel
        $('.modal-footer button:not(".btn-default")').remove();
        // Set input values
        
        $('#title').val(data.event ? data.event.title : '');   
       
        $('#description').val(data.event ? data.event.description : '');
       
        $('#start').val(data.event ? data.event.start : '');
        $('#end').val(data.event ? data.event.end : '');
        $('#color').val(data.event ? data.event.color : '#3a87ad');
        
        // Create Butttons
        $.each(data.buttons, function(index, button){
            $('.modal-footer').prepend('<button type="button" id="' + button.id  + '" class="btn ' + button.css + '">' + button.label + '</button>')
        })
        //Show Modal
        $('.modal').modal('show');
    }



    

    // Handle Click on Add Button
    $('.modal').on('click', '#add-event',  function(e){
      
        
      
      
       /* AQUIII */
        
    
       
        
        if(validator(['title', 'description'])) {
            
         //   console.log($('#title').val());

           
            
            $.post(base_url+'calendar/addEvent', {
                title: $('#title').val(),
                alunos_idalunos: $('#alunos_idalunos').val(),
                
                usuarios_idusuarios: $('#usuarios_idusuarios').val(),
                
                description: $('#description').val(),
                
                color: $('#color').val(),
                start: $('#start').val(),
                end: $('#end').val()
            },
           
            function(result){
                console.log(result);
                
                $('.alert').addClass('alert-success').text('Event added successfuly');
                $('.modal').modal('hide');
                $('#calendar').fullCalendar("refetchEvents");
                hide_notify();
            }) .fail(function(xhr,textstatus,error) {
                console.log(xhr.responseText,textstatus,error);
                alert(error );
              });
        }
    });

    //----------------------------------------------------------------------------------------

    // Handle click on Update Button
    $('.modal').on('click', '#update-event',  function(e){

        
        
        //quando clico no evento para alterar

        if(validator(['title', 'description'])) {
            $.post(base_url+'calendar/updateEvent', {
                id: currentEvent._id,
                title: $('#title').val(),
                description: $('#description').val(),
                color: $('#color').val(),
                
              //  start: $('#start').val(moment(start).format('YYYY-MM-DD HH:mm:ss')),
              //  end: $('#start').val(moment(start).format('YYYY-MM-DD HH:mm:ss')),
                
            }, function(result){
                $('.alert').addClass('alert-success').text('Evento alterado com sucesso');
                $('.modal').modal('hide');
                $('#calendar').fullCalendar("refetchEvents");
                hide_notify();
                
            });
        }
    });

    //----------------------------------------------------------------------------------------



    // Handle Click on Delete Button
    $('.modal').on('click', '#delete-event',  function(e){
        $.get(base_url+'calendar/deleteEvent?id=' + currentEvent._id, function(result){
            $('.alert').addClass('alert-success').text('Evento deletado com sucesso !');
            $('.modal').modal('hide');
            $('#calendar').fullCalendar("refetchEvents");
            hide_notify();
        });
    });

    function hide_notify()
    {
        setTimeout(function() {
                    $('.alert').removeClass('alert-success').text('');
                }, 2000);
    }


    // Dead Basic Validation For Inputs
    function validator(elements) {
        var errors = 0;
        $.each(elements, function(index, element){
            if($.trim($('#' + element).val()) == '') errors++;
        });
        if(errors) {
            $('.error').html('Por favor! Insira título e descrição!');
            return false;
        }
        return true;
    }
});

