// View Type
msw.VIEW_TOP		= 0;
msw.VIEW_SIDE		= 1;

// Game Mode
msw.GM_GAME			= 0;
msw.GM_SELECT		= 1;

msw.NUM_STARS 		= 3;
msw.DEADZONE 		= 20;

msw.NAME_COLOR		= cc.color ( 200, 200, 255, 255 );
msw.NAME_SHADE 		= cc.color (   0, 128, 255, 128 );
msw.DESC_COLOR 		= cc.color ( 255, 255, 255, 255 );
msw.INST_COLOR 		= cc.color ( 255, 200, 160, 255 );
msw.BOOK_COLOR 		= cc.color ( 200, 255, 160, 255 );

msw.INST			= 
	"■ Main Character Move / Stage Select ■\n" +
	"D-Key / Stick (Digital/Analog)\n" +
	"\n" +
	"■Start Stage■\n" +
	"[Z] Key / Button 1\n"+
	"\n" +
	"■Exit■\n" +
	"[ESC] Key";

msw.BOOK			=
	"『Game Maniax Shooting Game Algorithm』\n" +
	"(원저:마츠우라 켄이치로/츠카사 유키, 소프트뱅크 크리에이티브 발간)\n";

msw.MARGIN			= 10;
msw.UPDATE_STEP		= 1;

msw.BUTTON_PREV		= 0;
msw.BUTTON_NEXT		= 1;
msw.BUTTON_RESTART	= 2;
msw.BUTTON_MODE		= 3;

msw.Stage = cc.Class.extend
({
	ctor:function ( Root, Name, Desc, ViewType )
	{
		if ( ViewType === undefined )	
		{
			ViewType = msw.VIEW_TOP;
		}
		
		this.Root		= Root;
		this.Name   	= Name;
		this.Desc		= Desc;
		this.ViewType 	= ViewType;
	},
});

msw.Game = cc.Scene.extend
({
	ctor:function ( )
	{
		this._super ( );		
		
		this.Step = 0;
		this.SelectedStage = 0;
		this.GameMode = msw.GM_SELECT;
		
		this.Player = null
		this.Stages = [];
		
		// Input Listener ( Keyboard )
		this.Input = new msw.Input ( );		
		this.PrevStick  = false;
		this.PrevSelect = false;
		this.PrevPause  = false;
		this.Pausing 	= false;
		this.addChild ( this.Input );
		
		// UI
		this.AddUI ( );
		
		// Create Group Manager 
		this.GroupMgr = new msw.GroupMgr ( );
		this.addChild ( this.GroupMgr, 0 );
		
		// Make Frames
		msw.MakeFrames ( );
		
		// Make Stage 
		this.MakeStages ( );
		
		// Select Stage
		this.SelectStage ( );	
		
		// Update
		this.scheduleUpdate ( );	
	},
	
	AddStage:function ( Stage, Name, Inst, ViewType )
	{
		this.Stages.push ( new msw.Stage ( Stage, Name, Inst, ViewType ) );
	},	
	
	AddUI:function ( )
	{
		// Background Color Layer
		this.BGLayer = new cc.LayerColor ( cc.color ( 0, 0, 64, 255 ) );
		this.addChild ( this.BGLayer, -1 );

		// Description Layer
		this.TextLayer = new cc.Layer ( );
		this.addChild ( this.TextLayer, 1 );		

		// Buttons
		var 	button = new ccui.Button ( );
		button.setTouchEnabled ( true );
		button.loadTextures ( "res/b1.png", "res/b2.png", "" );
		button.x = cc.winSize.width * 0.5 - 80;
		button.y = 45;
		button.tag = msw.BUTTON_PREV;
		button.addTouchEventListener ( this.buttonEvent, this );
		this.addChild ( button, 1 );

		// Buttons
		var 	button = new ccui.Button ( );
		button.setTouchEnabled ( true );
		button.loadTextures ( "res/f1.png", "res/f2.png", "" );
		button.x = cc.winSize.width * 0.5 + 80;
		button.y = 45;
		button.tag = msw.BUTTON_NEXT;
		button.addTouchEventListener ( this.buttonEvent, this );
		this.addChild ( button, 1 );

		// Buttons
		var 	button = new ccui.Button ( );
		button.setTouchEnabled ( true );
		button.loadTextures ( "res/r1.png", "res/r2.png", "" );
		button.x = cc.winSize.width * 0.5;
		button.y = 45;
		button.tag = msw.BUTTON_RESTART;
		button.addTouchEventListener ( this.buttonEvent, this );
		this.addChild ( button, 1 );	
		
		// Buttons		
		var 	button = new ccui.Button ( );
		button.setTouchEnabled ( true );
		button.setScale9Enabled ( true );
		button.setContentSize ( cc.size ( 100, 45 ) );
		button.loadTextures ( "res/button1.png", "res/button2.png", "" );
		button.x = cc.winSize.width - 80;
		button.y = 42;		
		button.tag = msw.BUTTON_MODE;
		button.addTouchEventListener ( this.buttonEvent, this );
		this.addChild ( button, 1 );	
		
		var 	text = new ccui.Text ( );
		text.setString ( "Mode" );
		text.setFontName ( "Arial" );
		text.setFontSize ( 20 );
		text.x = button.width  * 0.5;
		text.y = button.height * 0.5;
		button.addChild ( text );		
	},
	
	MakeStages:function ( )
	{
		var 	sg = this.GroupMgr.GetGroup ( msw.GROUP_STAGE  );
		var 	mg = this.GroupMgr.GetGroup ( msw.GROUP_PLAYER );

		// Explosion
		var		explosion2 = new msw.Object ( sg );
		explosion2.SetFrame ( "explosion.big" );
		explosion2.SetScale ( 0.2, 0.2, 0.2, 0.2 );	
		explosion2.SetAlpha ( 2, -0.04 );
		explosion2.SetNext ( null, 50 );
		var		explosion = new msw.Object ( sg );
		explosion.AddSpawn ( explosion2, 0, 0, 1 );
	
		// Main Character
		this.Player = new msw.Object ( mg );
		this.Player.SetFrame ( "flare" );	
		this.Player.SetPlayer ( 0, cc.winSize.width / 2, msw.MARGIN + 100, 5 );
		this.Player.SetAutoRoll ( 10, 0.5 );
		this.Player.SetDamage ( 1, 1, explosion, null, false, false );	
				
		// Stages
		msw.MakeStagesBullet ( this );
	},
	
	SelectStage:function ( )
	{
		this.GameMode = msw.GM_SELECT;
		
		if ( this.Stages.length == 0 )
		{
			return;
		}
		
		// Clear Groups
		this.GroupMgr.Clear ( );
	
		// Select Stage
		var 	size = this.Stages.length;
		this.SelectedStage = ( this.SelectedStage % size + size ) % size;		
		var		stage = this.Stages [ this.SelectedStage ];		
		
		// Main Character
		var 	mg = this.GroupMgr.GetGroup ( msw.GROUP_PLAYER ); 
		mg.SetInput ( null );	
		
		// Stage
		var 	sg = this.GroupMgr.GetGroup ( msw.GROUP_STAGE );
		var		obj = sg.Create ( );	
		if ( obj )
		{			
			obj.Init ( stage.Root );
		}	
	
		// View Setting 	
		var		hit = new msw.Hit ( msw.MARGIN, cc.winSize.width - msw.MARGIN, msw.MARGIN, cc.winSize.height - msw.MARGIN ); 
		var 	vt = stage.ViewType;		
		this.GroupMgr.SetScreenHit ( hit );		
		this.GroupMgr.SetDeadzoneHit ( new msw.Hit ( hit.l - msw.DEADZONE, hit.r + msw.DEADZONE, hit.b - msw.DEADZONE, hit.t + msw.DEADZONE ) );			

		// Description : Stage Name & Description
		this.TextLayer.removeAllChildren ( true );	
		
		var		size = cc.winSize;
		var		text = "Stage#" + ( this.SelectedStage + 1 );
		var		label = new cc.LabelTTF ( text, "Arial", 22 );		
		label.setPosition ( cc.p ( size.width / 2, size.height / 2 + 310 ) );
		label.setColor ( msw.NAME_COLOR );		
		this.TextLayer.addChild ( label );

		var		label = new cc.LabelTTF ( stage.Name, "Arial", 22 );		
		label.setPosition ( cc.p ( size.width / 2, size.height / 2 + 280 ) );
		label.setColor ( msw.NAME_COLOR );		
		this.TextLayer.addChild ( label );

		var		label = new cc.LabelTTF ( stage.Desc, "Arial", 22 );		
		label.setPosition ( cc.p ( size.width / 2, size.height / 2 + 230 ) );
		label.setColor ( msw.INST_COLOR );		
		this.TextLayer.addChild ( label );

		var		label = new cc.LabelTTF ( msw.INST, "Arial", 22, cc.size ( 440, 240 ), cc.TEXT_ALIGNMENT_CENTER );		
		label.setPosition ( cc.p ( size.width / 2, size.height / 2 + 50 ) );
		label.setColor ( msw.INST_COLOR );		
		this.TextLayer.addChild ( label );

		var		label = new cc.LabelTTF ( msw.BOOK, "Arial", 22, cc.size ( 440, 240 ), cc.TEXT_ALIGNMENT_CENTER );		
		label.setPosition ( cc.p ( size.width / 2, size.height / 2 - 250 ) );
		label.setColor ( msw.BOOK_COLOR );		
		this.TextLayer.addChild ( label );			
	},	
	
	StartStage:function ( )
	{
		this.GameMode = msw.GM_GAME;
		
		if ( this.Stages.length == 0 )
		{
			return;
		}
		
		// Clear Groups
		this.GroupMgr.Clear ( );	

		// Select Stage
		var 	size = this.Stages.length;
		this.SelectedStage = ( this.SelectedStage % size + size ) % size;		
		var		stage = this.Stages [ this.SelectedStage ];				

		// Main Character
		var 	mg = this.GroupMgr.GetGroup ( msw.GROUP_PLAYER ); 
		mg.SetInput ( this.Input );				
		
		// Stage
		var 	sg = this.GroupMgr.GetGroup ( msw.GROUP_STAGE );
		var		obj = sg.Create ( );	
		if ( obj )
		{
			obj.Init ( stage.Root );
		}	
		
		// Description : Stage Name & Description
		this.TextLayer.removeAllChildren ( true );	
		
		var		label = new cc.LabelTTF ( stage.Name, "Arial", 22 );	
		label.ignoreAnchorPointForPosition ( true );
		label.setPosition ( cc.p ( 50, cc.winSize.height - 50 ) );
		label.setColor ( msw.NAME_COLOR );		
		this.TextLayer.addChild ( label );		
	},	
	
	update:function ( dt )
	{
//		cc.log ( "Step : " + this.Step++ );
		
		// Update Input State
		this.Input.UpdateState ( );
		var		is = this.Input.GetState ( 0 );

		// Game Processing
		if ( !this.Pausing ) 
		{					
			for ( var i = 0; i < msw.UPDATE_STEP; i++ )
			{
				this.GroupMgr.Check  ( );
				this.GroupMgr.Update ( );				
			}
			
			if ( is.IsTouch )
			{
				return;
			}
			
			// Select Mode
			switch ( this.GameMode ) 
			{
				case msw.GM_GAME :
					if ( !this.PrevSelect && is.Button [ 0 ] ) 
					{
						this.GameMode = msw.GM_SELECT;
						this.SelectStage ( );
					}					
					break;
	
				case msw.GM_SELECT :	
					if ( !this.PrevStick && is.Left )
					{
						this.SelectedStage--;
						this.SelectStage ( );
					}
					else if ( !this.PrevStick && is.Right ) 
					{
						this.SelectedStage++;
						this.SelectStage ( );
					} 
					else if ( !this.PrevStick && is.Up ) 
					{
						this.SelectedStage -= 10;
						this.SelectStage ( );
					}
					else if ( !this.PrevStick && is.Down ) 
					{
						this.SelectedStage += 10;
						this.SelectStage ( );
					} 
					else if ( !this.PrevSelect && is.Button [ 0 ] ) 
					{
						
						this.StartStage ( );
					}									
					break;
			}

			this.PrevStick  = is.Up || is.Down || is.Left || is.Right;
			this.PrevSelect = is.Button [ 0 ];			
		}

		// Pause
		if ( !this.PrevPause && is.Button [ 3 ] ) 
		{
			this.Pausing = !this.Pausing;
		}
		this.PrevPause = is.Button [ 3 ];		
	
	},
	
	buttonEvent:function ( sender, type )
	{
		if ( type == ccui.Widget.TOUCH_ENDED )
		{
			switch ( sender.tag )
			{
				case msw.BUTTON_PREV :
					this.SelectedStage--;
					this.SelectStage ( );
					break;
					
				case msw.BUTTON_NEXT :
					this.SelectedStage++;
					this.SelectStage ( );
					break;
					
				case msw.BUTTON_RESTART	:
					if ( this.GameMode == msw.GM_GAME )
					{
						this.StartStage ( );
					}
					else
					{
						this.SelectStage ( );
					}
					break;
					
				case msw.BUTTON_MODE :
					if ( this.GameMode == msw.GM_GAME )
					{
						this.SelectStage ( );
					}
					else
					{
						this.StartStage ( );
					}
					break;
			}			
		}

	},
});

