
msw.MAX_PLAYERS = 16;
msw.MAX_BUTTONS = 128;
msw.TOUCH_SENSITIVE = 0.2;

msw.InputState = cc.Class.extend 
({	
	ctor:function ( )
	{
		this.Button = [];
		
		this.Clear ( );	
	},
	
	Clear:function ( )
	{
		this.Up  = this.Down  = this.Left  = this.Right  = false;
		this.Up2 = this.Down2 = this.Left2 = this.Right2 = false;
		
		for ( var i = 0; i < msw.MAX_BUTTONS; i++ )
		{
			this.Button [ i ] = false;
		}
		
		this.AnalogX  = this.AnalogY  = 0;
		this.AnalogX2 = this.AnalogY2 = 0;		
		
		this.IsTouch  = false;
	},
});


msw.Input = cc.Node.extend 
({	
	ctor:function ( )
	{
		this._super ( );
		
		this.States  	= [];
		this.Keyboard 	=	
		{
			Available	: false,
			State		: null,
		};
		this.Touch 		=
		{
			Available	: false,
			State		: null,
		};
		
		// States
		for ( var i = 0; i < msw.MAX_PLAYERS; i++ )
		{
			this.States.push ( new msw.InputState ( ) );
		}
			
		// Keyboard
		if ( 'keyboard' in cc.sys.capabilities ) 
		{
			this.Keyboard.Available = true;
			this.Keyboard.State		= new msw.InputState ( );
			
			cc.eventManager.addListener
			({
				event : cc.EventListener.KEYBOARD,
				onKeyPressed:function ( key, event )
				{
					event.getCurrentTarget ( ).keyState ( key, event, true );
				},
				onKeyReleased:function ( key, event )
				{
					event.getCurrentTarget ( ).keyState ( key, event, false );
				}
			}, this );
		} 
		else 
		{			
			cc.log ( "KEYBOARD not supported" );
		}	
		
//		if ( 'touches' in cc.sys.capabilities )
		{		
			this.Touch.Available = true;
			this.Touch.State	 = new msw.InputState ( );
			
			cc.eventManager.addListener 
			({
				event: cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesBegan:function ( touches, event ) 
				{
					event.getCurrentTarget ( ).touchesState ( touches, true )					
				},				
				onTouchesMoved:function ( touches, event ) 
				{
					event.getCurrentTarget ( ).touchesState ( touches, true )					
				},
				onTouchesEnded:function ( touches, event ) 
				{
					event.getCurrentTarget ( ).touchesState ( touches, false )					
				}			
			}, this );
		}
//		else 
		{
//			cc.log ( "Touch not supported" );
		}
		
//		this.schedule ( this.step, 0.1 );
	},
	
	GetState:function ( ID )
	{
		return this.States [ ID ];
	},
	
	ClearState:function ( )
	{
		for ( var i = 0; i < msw.MAX_PLAYERS; i++ )
		{
			this.States [ i ].Clear ( );
		}
	},
	
	UpdateState:function ( )
	{
		this.ClearState ( );
		
		var		S = this.States [ 0 ];
		
		if ( this.Keyboard.Available ) 
		{					
			S.Up 		= this.Keyboard.State.Up;		
			S.Down 		= this.Keyboard.State.Down;		
			S.Left 		= this.Keyboard.State.Left;		
			S.Right 	= this.Keyboard.State.Right;	
			S.Button[0] = this.Keyboard.State.Button[0];	
			S.Button[1] = this.Keyboard.State.Button[1];	
			S.Button[2] = this.Keyboard.State.Button[2];	
			S.Button[3] = this.Keyboard.State.Button[3];		
			S.Up2 		= this.Keyboard.State.Up2;		
			S.Down2 	= this.Keyboard.State.Down2;		
			S.Left2 	= this.Keyboard.State.Left2;		
			S.Right2 	= this.Keyboard.State.Right2;
			
			S.AnalogX  += ( S.Left ? -1 : ( S.Right ? 1 : 0 ) );		
			S.AnalogY  += ( S.Down ? -1 : ( S.Up    ? 1 : 0 ) );

			S.AnalogX2 += ( S.Left2 ? -1 : ( S.Right2 ? 1 : 0 ) );	
			S.AnalogY2 += ( S.Down2 ? -1 : ( S.Up2    ? 1 : 0 ) );				
		}
		
		if ( this.Touch.Available )
		{							
			S.IsTouch  = !( this.Touch.State.AnalogX == 0 && this.Touch.State.AnalogY == 0 );
			
			S.AnalogX  += this.Touch.State.AnalogX;
			S.AnalogY  += this.Touch.State.AnalogY;
			
			S.Up 	= S.AnalogY > 0;		
			S.Down 	= S.AnalogY < 0;		
			S.Left 	= S.AnalogX < 0;		
			S.Right = S.AnalogX > 0;				
			
			this.Touch.State.AnalogX = 0;
			this.Touch.State.AnalogY = 0;			
		}
	},
	
	keyState:function ( Key, Event, Pressed )
	{
		switch ( Key )
		{
			case cc.KEY.up 		: 	this.Keyboard.State.Up 			= Pressed;	break;
			case cc.KEY.down 	: 	this.Keyboard.State.Down 		= Pressed;	break;
			case cc.KEY.left 	: 	this.Keyboard.State.Left 		= Pressed;	break;
			case cc.KEY.right 	: 	this.Keyboard.State.Right 		= Pressed;	break;
			case cc.KEY.z		: 	this.Keyboard.State.Button[0] 	= Pressed;	break;
			case cc.KEY.x		: 	this.Keyboard.State.Button[1] 	= Pressed;	break;
			case cc.KEY.c		: 	this.Keyboard.State.Button[2] 	= Pressed;	break;
			case cc.KEY.v		: 	this.Keyboard.State.Button[3] 	= Pressed;	break;
			case cc.KEY.e 		: 	this.Keyboard.State.Up2 		= Pressed;	break;
			case cc.KEY.d 		: 	this.Keyboard.State.Down2 		= Pressed;	break;
			case cc.KEY.s 		: 	this.Keyboard.State.Left2 		= Pressed;	break;
			case cc.KEY.f 		: 	this.Keyboard.State.Right2 		= Pressed;	break;						
		}	
	},
	
	touchesState:function ( Touches, Pressed )
	{
		var		Touch = Touches [ 0 ];
		var		Diff  = Touch.getDelta ( );

		this.Touch.State.AnalogX += Diff.x * msw.TOUCH_SENSITIVE;
		this.Touch.State.AnalogY += Diff.y * msw.TOUCH_SENSITIVE;	
	},
});
