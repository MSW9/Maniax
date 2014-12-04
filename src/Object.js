msw.MAX_SPAWNS 			= 20;
msw.MAX_HISTS 			= 40;
msw.MAX_LOCKON_LASERS 	= 10;
msw.MAX_STOCK 			= 10;
msw.MAX_LOCKS 			= 100;

// Damage Mode
msw.DAMAGE_BOTH			= 0;
msw.DAMAGE_TAKE			= 1;

// Target Type
msw.TG_RANDOM_PLAYER	= 0;
msw.TG_LOCKED_ENEMY		= 1;
msw.TG_OBJECT			= 2;
msw.TG_RANDOM_ENEMY		= 3;

// Movable Sight State
msw.MSS_NORMAL			= 0;
msw.MSS_SIGHT			= 1;
msw.MSS_ATTACK			= 2;

// Inheriting Spawn/Next
msw.IH_YAW 				= 1;

//16 Way, Speed 3 Table	
msw.TableV3 			= 
[
	 [ 0, 3], [ 1, 3], [ 2, 2], [ 3, 1],
	 [ 3, 0], [ 3,-1], [ 2,-2], [ 1,-3],
	 [ 0,-3], [-1,-3], [-2,-2], [-3,-1],
	 [-3, 0], [-3, 1], [-2, 2], [-1, 3]
];	

msw.TableDDA 			= null;

msw.Copy = function ( dst, src )
{
//	cc.log ( "<<<" );
	for ( var key in src )
	{
		var		copy = src [ key ];
		
		if ( (typeof copy) == "function" )
		{
			continue;
		}
				
//		cc.log ( key + " , " + copy );	
		
		if ( (typeof copy) == "object" 
			 && copy
			 //|| !(copy instanceof msw.Hit )			 
			 && !(copy instanceof cc.Class)
			 && !(copy instanceof cc.Node) 
			 && !(copy instanceof msw.Object)
			 ||  (copy instanceof msw.Hit)
		)
		{				
			msw.Copy ( dst [ key ], copy );			
		} 
		else 
		{							
			dst [ key ] = copy;
		}
	}
//	cc.log ( ">>>" );
};

msw.Clone = function ( src )
{
	var 	dst = (src.constructor) ? new src.constructor : {};
	
//	cc.log ( "<<<" );
	
	for ( var key in src )
	{
		var		copy = src [ key ];

		if ( (typeof copy) == "function" )
		{
			continue;
		}

//		cc.log ( key + " , " + copy );	

		if ( (typeof copy) == "object" 
			&& copy
			//|| !(copy instanceof msw.Hit )			 
			&& !(copy instanceof cc.Class)
			&& !(copy instanceof cc.Node) 
			&& !(copy instanceof msw.Object)
			||  (copy instanceof msw.Hit)
		)
		{				
			dst [ key ] = msw.Clone ( copy );			
		} 
		else 
		{							
			dst [ key ] = copy;
		}
	}	
	
//	cc.log ( ">>>" );	
	
	return dst;
}

msw.Object = cc.Class.extend
({
	ctor:function ( Group )
	{				
		this.Group 				= Group;
		this.Parent				= null;
		
		this.Used  				= false;
		this.Dead  				= false;
		
		this.X					= 0.0;
		this.Y					= 0.0;
		this.Z					= 0.0;
		this.XRand				= 0.0;
		this.YRand				= 0.0;
		this.RX					= 0.0;
		this.RY					= 0.0;
		
		this.VX					= 0.0;
		this.VY					= 0.0;		
		this.Speed				= 0.0;
		this.SpeedRnd			= 0.0;

		this.AX					= 0.0;
		this.AY					= 0.0;		
		this.Accel				= 0.0;
		
		this.Angle				= 0.0;
		this.AngleRnd			= 0.0;
		
		this.Frame				= null;
		this.Sprite				= null;
		this.Color				= 0;
		
		this.Damage				=
		{
			Str					: 1.0,
			Vit					: 1.0,
			SpawnModel			: null,
			NextModel			: null,
			Invincible			: true,
			Transparent			: false,
			TargetOnly			: false,
			Hit					: new msw.Hit ( 0, 0, 0, 0 )
		};
		
		this.Inherit			= 0xffffffff;
		
		this.Valid 				= 
		{
			FPN					: false,
			DDA					: false,
			INTG				: false,						
			Aiming				: false,
			Directed			: false,
			Looping				: false,
			Player				: false,			
			Roll				: false,
			Yaw					: false,
			Pos 				: false, 	
			Homing				: false,
			Scale				: false,		
			Lock				: false,
			Target				: false,
			Throw				: false,
			Arm					: false,
			RFShot				: false,
			ChangeColor			: false,
			Reflect				: false,
			Collision			: false,
			Graze				: false,			
			FollowParent		: false,
			Slow				: false,
			Quick				: false, 
			MovableSightB		: false,
			MovableSightS		: false,
			Captee				: false,
			Captor				: false, 
			Orbit				: false, 
			Tentacle			: false, 
			Joint				: false, 
			Bg					: false, 
			LimitedScrollX		: false, 
			FreeScrollY			: false, 
			Gravity				: false, 
			ControlScrollY		: false,
			BGRotate 			: false,
			Star				: false,
			Berserk				: false,
			LockOnLaser			: false,
			Laser				: false, 
			Weapon				: false, 
			Warp				: false, 
			SCButton			: false, 
			SCItem				: false,
			Barrier				: false,
			Next				: false,
			GroundHit			: false,
			SightedBomb			: false, 		
			Docking				: false, 
			TurnMarker			: false, 
			Option				: false, 
			Walk				: false,	
			SAItem 				: false, 
			Punch 				: false,
			Underwater 			: false,
			Transform 			: false,			
		};		
		
		// Previous Position
		this.HistIndex			= -1;
		this.Hists				= [];
		for ( var i = 0; i < msw.MAX_HISTS; i++ ) 
		{
			this.Hists [ i ] 	=
			{
				X				: 0.0,
				Y				: 0.0,
				Yaw				: 0.0,
				Roll			: 0.0,
				Valid			: false,
			};
		}
		
		// Tail
		this.Prec				= null;
		this.PrecDelay			= 0;
		this.PrecHist 			=
		{
			X					: 0.0,
			Y					: 0.0,
			Yaw					: 0.0,
			Roll				: 0.0,
			Valid				: false,
		};

		this.RefCount 			= 0;
		
		// Spawn
		this.NumSpawns			= 0;
		this.Spawns				= [];
		for ( var i = 0; i < msw.MAX_SPAWNS; i++ ) 
		{
			this.Spawns [ i ] 	=
			{
				Model			: null,
				RX				: 0.0,
				RY				: 0.0,
				Timer			: 0,
				Cycle			: 0,
				Count			: 0,
				NWayCount		: 0,
				NWayAngle		: 0.0,
				CircleCount		: 0,
				CircleOdd		: false,
			};
		}
		
		this.Roll 	 			= 
		{
			Pos 				: 0.0,
			Max 				: 0.0,
			Speed 				: 0.0,
			Auto 				: false,
			OnVX 				: false,
			Plus 				: 0,
		}
		
		this.Yaw 				=
		{
			Pos					: 0.0,
			Speed				: 0,
			Auto				: false,
		};		
		
		// Target
		this.Target 			=
		{
			Type				: msw.TG_RANDOM_PLAYER,
			ID					: 0,
			AlterModel			: null,
			Model				: null,
		};
		
		this.MoveableSightB = 
		{
			ButtonID			: 0,
			State				: msw.MSS_NORMAL,
			X					: 0.0,
			Y					: 0.0,
			Speed				: 0.0,
			Model				: null,
			SightModel			: null,
			AttackModel			: null,
		};
		
		// Position
		this.Pos 				=
		{
			X					: 0.0,
			Y					: 0.0,
		};		
		
		// Scale
		this.Scale				=
		{
			X					: 1.0,
			Y					: 1.0,
			VX					: 0.0,
			VY					: 0.0,				
		};
		
		// Alpha				
		this.Alpha				=
		{
			
			X					: 1.0,
			V					: 0.0,
			Add					: false,
		};
		
		// Next
		this.Next				=
		{
			Model				: null,
			Timer				: 0,
		};
		
		// Homing
		this.Homing 			=
		{
			Angle				: 0.0,
			Target				: null,
			Simple				: false,
		};		
		
		// Player
		this.Player				=
		{
			ID					: 0,
			X					: 0,
			Y					: 0,
		};	
		
		// DDA
		this.DDA 				= 
		{
			X					: 0,
			Y					: 0,
			VX					: 0,
			VY					: 0,
			DX					: 0,
			DY					: 0,
			Speed				: 0, 
			Diff				: 0,
		};

		// FPN
		this.FPN 				=		
		{
			X					: 0,
			Y					: 0,
			VX					: 0,
			VY					: 0,
		};

		// 16 Way, Speed 3
		this.INTG				=
		{
			X					: 0,
			Y					: 0,
			VX					: 0,
			VY					: 0,
		};
		
		/*		
		ItemEffect.Accel=0;

		// 무기
		LockOnLaser.Locked=false;
		 */		
	},
	
	Init:function ( Model, Parent )
	{
		if ( Parent === undefined )
		{
			Parent = null;
		}		

		if ( this.Sprite )
		{
			this.Group.removeChild ( this.Sprite );
			this.Sprite = null;
		}
		
		var		Used = this.Used;
		msw.Copy ( this, Model );
		this.Used = Used;

		this.Parent = Parent;
		this.Dead = false;
						
		if ( this.Frame )
		{					
			this.Sprite = new cc.Sprite ( );			
			this.Sprite.setSpriteFrame ( this.Frame.Get ( ) );			
			this.Group.addChild ( this.Sprite );		
		}
		
		this.Speed = Model.Speed + Model.SpeedRnd * this.Rand05 ( );	
		this.Angle = Model.Angle + Model.AngleRnd * this.Rand05 ( );			
/*		
		LockOnLaser=model->LockOnLaser;
		if (Valid.LockOnLaser) {
			for (i=0; i<LockOnLaser.MaxAvail; i++) {
				LockOnLaser.LaserMover[i]=NULL;
				LockOnLaser.TargetMover[i]=NULL;
			}
		}
*/

		// Scale
		if ( this.Valid.Scale )
		{
			this.Scale =
			{
				X	: Model.Scale.X,
				Y	: Model.Scale.Y,
				VX	: Model.Scale.VX,
				VY	: Model.Scale.VY,				
			};			
		}
		else 
		{
			this.Scale =
			{
				X	: 1.0,
				Y	: 1.0,
				VX	: 0,
				VY	: 0,				
			};	
		}
		
		// Next State
		this.Next =
		{
			Model	: Model.Next.Model,
			Timer	: Model.Next.Timer,
		};	
		
		// Position
		this.Pos.X = Model.Pos.X;
		this.Pos.Y = Model.Pos.Y;
		
		if ( this.Valid.Pos )
		{
			this.X += Model.Pos.X + this.XRand * this.Rand05 ( );
			this.Y += Model.Pos.Y + this.YRand * this.Rand05 ( );
		}
		if ( this.Parent )
		{
			this.X += this.Parent.X;
			this.Y += this.Parent.Y;
		}
		
		// Aiming
		if ( Model.Valid.Aiming ) 
		{			
			if ( !this.Valid.Target || this.Target.Type == msw.TG_RANDOM_PLAYER ) 
			{
				var 	target = this.GetRandomPlayer ( );
		
				if ( target ) 
				{					
					if ( Model.Valid.DDA ) 
					{
						this.InitAimingDDA ( target.X, target.Y, this.Speed );
					} 
					else if ( Model.Valid.FPN )
					{
						this.InitAimingFPN ( target.X, target.Y, this.Speed );
					} 
					else 
					{
						this.InitAiming ( target.X, target.Y, this.Speed, this.Angle );
					}					
				} 
				else 
				{
					this.Group.Remove ( this );
					return;
				}		
			} 		
			else if ( this.Target.Type == msw.TG_LOCKED_ENEMY )
			{
/*					
				target=GetLockedEnemy(model->Target.ID);
				if (target) 
				{
					InitAiming(target->X, target->Y, Speed, Angle);
				}
				else 
				{
					if (Target.AlterModel) 
					{
						Init(Target.AlterModel, parent);
					}
					else 
					{
						Group->Delete(this);
					}
					return;
				}
*/				
			}			
			else if ( this.Target.Type == msw.TG_OBJECT ) 
			{
/*				
				target=Target.Mover;
				if (target) 
				{
					InitAiming(target->X, target->Y, Speed, Angle);
				}
				else 
				{
					if (Target.AlterModel) 
					{
						Init(Target.AlterModel, parent);
					}
					else
					{
						Group->Delete(this);
					}
					return;
				}
*/				
			}
			else if ( this.Target.Type == msw.TG_RANDOM_ENEMY ) 
			{
				/*
				target=GetGroup(ENEMY_GROUP)->GetRandomUsedMover();
				if (target) 
				{
					InitAiming(target->X, target->Y, Speed, Angle);
				} 
				else 
				{
					if (Target.AlterModel) 
					{
						Init(Target.AlterModel, parent);
					}
					else 
					{
						Group->Delete(this);
					}
					return;
				}
				*/
			}
		}

		// Directed
		if ( Model.Valid.Directed ) 
		{			
			if ( this.Parent && ( this.Inherit & msw.IH_YAW ) )
			{
				this.Angle += this.Parent.Yaw.Pos;
			}
			
			if ( this.Valid.DDA )
			{
				this.InitDirectedDDA ( this.Angle, this.Speed );
			} 
			else if ( this.Valid.INTG ) 
			{
				this.InitDirected16_30 ( this.Angle );
			} 
			else 
			{
				this.InitDirected ( this.Speed, this.Angle );
			}
		}

		// Looping
		if ( Model.Valid.Looping ) 
		{
 /*
			Looping=model->Looping;
			if (!parent) 
			{
				Group->Delete(this);
				return;
			}
			parent->RefCount++;
			Looping.Target=parent;
			float rad=D3DX_PI*2*Angle;
			X=Looping.Target->X+Looping.Radius*cos(rad);
			Y=Looping.Target->Y+Looping.Radius*sin(rad);
*/			
		}

		// Roll
		this.Roll = 
		{
			Pos 	: Model.Roll.Pos,
			Max 	: Model.Roll.Max,
			Speed 	: Model.Roll.Speed,
			Auto 	: Model.Roll.Auto,
			OnVX 	: Model.Roll.OnVX,
			Plus 	: Model.Roll.Plus,
		};
		if ( !this.Valid.Roll )
		{
			this.Roll.Pos = 0;
		}

		// Yaw
		this.Yaw =
		{
			Pos		: Model.Yaw.Pos,
			Speed	: Model.Yaw.Speed,
			Auto	: Model.Yaw.Auto,
		};		
		if ( !this.Valid.Yaw )
		{
			this.Yaw.Pos = 0;
		}

/*
		// 생성(레이저)
		Laser=model->Laser;
		if (Valid.Laser) InitLaser(model, parent);

		// 이력
		HistIndex=model->HistIndex;
		if (HistIndex>=0) {
			for (i=0; i<MAX_HISTS; i++) {
				HIST* hist=&Hists[i];
				hist->X=X;
				hist->Y=Y;
				hist->Yaw=Yaw.Pos;
				hist->Roll=Roll.Pos;
				hist->Valid=false;
			}
		}

		// 꼬리
		Prec=model->Prec;
		PrecDelay=model->PrecDelay;
		RefCount=0;
*/
		// 생성
		this.NumSpawns = Model.NumSpawns;
		for ( var i = 0; i < this.NumSpawns; i++ )
		{
			this.Spawns [ i ] 	=
			{
				Model			: Model.Spawns [ i ].Model,
				RX				: Model.Spawns [ i ].RX,
				RY				: Model.Spawns [ i ].RY,
				Timer			: Model.Spawns [ i ].Timer,
				Cycle			: Model.Spawns [ i ].Cycle,
				Count			: Model.Spawns [ i ].Count,
				NWayCount		: Model.Spawns [ i ].NWayCount,
				NWayAngle		: Model.Spawns [ i ].NWayAngle,
				CircleCount		: Model.Spawns [ i ].CircleCount,
				CircleOdd		: Model.Spawns [ i ].CircleOdd,
			};					
		}

		// Main Character
		if ( Model.Valid.Player )
		{
			this.Player = Model.Player;
			this.X = Model.Player.X;
			this.Y = Model.Player.Y;
		}	
/*
		// 무기
		Weapon=model->Weapon;
		if (Valid.Weapon) {
			Weapon.Cmd.HistIndex=0;
			for (i=0; i<NUM_CMD_HIST; i++) Weapon.Cmd.Hist[i]=CMD_NONE;
		}
*/

		// Homing
		if ( Model.Valid.Homing )
		{
/*		
			Homing=model->Homing;
			if (Valid.Target) {
				switch (Target.Type) {
				case TG_RANDOM_MYSHIP: target=GetRandomMyShip(); break;
				case TG_OBJECT: target=Target.Mover; break;
				}
			} else {
				target=GetRandomMyShip();
			}
			Homing.Target=target;
			if (target) {
				if (Valid.Directed) {
					InitDirected(Speed, Angle);
				} else {
					InitAiming(target->X, target->Y, Speed, Angle);
				}
				target->RefCount++;
			} else {
				Group->Delete(this);
				return;
			}
*/			
		}

		// 워프
/*		
		Warp = model->Warp;
		if ( this.Valid.Warp )
		{
			Warp.Input=0;
			Warp.Released=true;
			Warp.Time=0;
		}
*/
/*		
		// 버튼에 의한 스피드 조절
		SCButton=model->SCButton;
		if ( this.Valid.SCButton) Speed=SCButton.MinSpeed;
*/
/*		
		// 아이템에 의한 스피드 조절
		SCItem=model->SCItem;
		if ( this.Valid.SCItem) Speed=SCItem.MinSpeed;	
*/
/*		
		// 보호막
		Barrier=model->Barrier;
		if (Valid.Barrier) {
			Barrier.Mover=New(Barrier.Model);
			Barrier.Mover->X=X;
			Barrier.Mover->Y=Y;
		}
*/
/*		
		// 궤적
		if ( this.Valid.Orbit && Orbit.Count>0) {
			VX=Orbit.Data[0].VX*Orbit.XMul;
			VY=Orbit.Data[0].VY*Orbit.YMul;
		}
*/
		// Follow Parent
		if ( this.Valid.FollowParent )
		{
/*			
			Parent->RefCount++;
			X=Parent->X+RX;
			Y=Parent->Y+RY;
*/			
		}
		
		this.PostUpdate ( );
	},
	
	Create:function ( Model )
	{
		if ( Model === undefined )
		{
			var		obj = this.Group.Create ( );
			if ( obj )
			{
				obj.Init ( this, null );
			}
			return obj;				
		}
		
		if ( !Model )
		{
			return null;
		}
		
		var		obj = Model.Group.Create ( );
		if ( obj ) 
		{
			obj.Init ( Model, this );
		}
		return obj;		
	},
	
	GetGroup:function ( ID )
	{
		return this.Group.GetManager ( ).GetGroup ( ID );
	},
	
	Rand05:function ( ) 
	{
		return Math.random ( ) - 0.5; 
	},
	
	Rand1:function ( )
	{
		return Math.random ( ); 
	},
	
	Check:function ( )
	{
/*		
		int i;

		if (Prec) {
			PrecHist=Prec->Hists[(Prec->HistIndex-PrecDelay+MAX_HISTS)%MAX_HISTS];
		}

		// 지면(미사일)
		CMoverGroup* gg=GetGroup(GROUND_GROUP);
		if (Valid.GroundHit && Obj3D) {
			GroundHit.HitX=GroundHit.HitY=false;
			float vx=VX, vy=VY;
			if (GroundHit.ModeX==GR_ALONG) {
				CHit hit=Obj3D->GetHit(HIT_CORE);
				hit.SetPos(X+vx, Y+vy);
				if (gg->FirstHit(&hit)) { GroundHit.HitX=true; vx=0; }
			} else
				if (GroundHit.ModeX==GR_REFLECT) {
					CHit hit=Obj3D->GetHit(HIT_CORE);
					hit.SetPos(X+vx, Y+vy);
					if (gg->FirstHit(&hit)) { GroundHit.HitX=true; vx=-vx; }
				}
			if (GroundHit.ModeY==GR_ALONG) {
				CHit hit=Obj3D->GetHit(HIT_CORE);
				hit.SetPos(X+vx, Y+vy);
				if (gg->FirstHit(&hit)) { GroundHit.HitY=true; vy=0; }
			} else
				if (GroundHit.ModeY==GR_REFLECT) {
					CHit hit=Obj3D->GetHit(HIT_CORE);
					hit.SetPos(X+vx, Y+vy);
					if (gg->FirstHit(&hit)) { GroundHit.HitY=true; vy=-vy; }
				}
			if (GroundHit.ModeX==GR_HIT || GroundHit.ModeY==GR_HIT) {
				CHit hit=Obj3D->GetHit(HIT_CORE);
				hit.SetPos(X+vx, Y+vy);
				CMover* mover;
				if (mover=gg->FirstHit(&hit)) {
					Damage.Vit-=mover->Damage.Str;
				}
			}
		}

		// 조준
		if (Valid.SightedBomb) {
			CHit sight_hit=SightedBomb.Ready->GetHit(HIT_CORE);
			sight_hit.L+=X+SightedBomb.SX;
			sight_hit.R+=X+SightedBomb.SX;
			sight_hit.B+=Y+SightedBomb.SY;
			sight_hit.T+=Y+SightedBomb.SY;
			CMoverGroup* eg=Group->GetManager()->GetGroup(ENEMY_GROUP);
			CMoverGroup* geg=Group->GetManager()->GetGroup(GROUND_ENEMY_GROUP);
			if (eg->FirstHit(&sight_hit) || geg->FirstHit(&sight_hit)) {
				SightedBomb.Locking=true;
			} else {
				SightedBomb.Locking=false;
			}
		}

		// 록 온 레이저
		if (Valid.LockOnLaser) {
			LOCKON_LASER& lol=LockOnLaser;

			// 록을 걸기
			CHit sight_hit=LockOnLaser.Ready->GetHit(HIT_CORE);
			sight_hit.SetPos(X+lol.SX, Y+lol.SY);
			CMoverGroup* eg=Group->GetManager()->GetGroup(ENEMY_GROUP);
			CMover* mover;
			if (lol.NumAvail>0 && (mover=eg->FirstHit(&sight_hit))) {
				do {
					if (!mover->LockOnLaser.Locked) {
						lol.NumAvail--;
						for (i=0; i<lol.MaxAvail && lol.TargetMover[i]; i++) ;
						lol.TargetMover[i]=mover;
						mover->RefCount++;
						mover->LockOnLaser.Locked=true;
					}
				} while (lol.NumAvail>0 && (mover=eg->NextHit(&sight_hit)));
			}

			// 록을 풀기
			int avail=0;
			for (i=0; i<lol.MaxAvail; i++) {
				CMover* mover;
				mover=lol.TargetMover[i];
				if (mover && mover->Dead) {
					lol.TargetMover[i]=NULL;
					mover->RefCount--;
					mover->LockOnLaser.Locked=false;
				}
				mover=lol.LaserMover[i];
				if (mover && mover->Dead) {
					lol.LaserMover[i]=NULL;
					mover->RefCount--;
				}
				if (!lol.TargetMover[i] && !lol.LaserMover[i]) avail++;
			}
			lol.NumAvail=avail;
		}

		// 배경
		if (Valid.Bg && Group==GetGroup(GROUND_GROUP)) {
			float sx=Bg.SX, sy=Bg.SY, sw=Bg.SW, sh=Bg.SH, cw=Bg.CW, ch=Bg.CH;
			int mw=Bg.MW, mh=Bg.MH, x0, y0, x1, y1;
			x0=(int)(sx/cw-1);
			y0=(int)(sy/ch-1);
			x1=(int)((sx+sw-1)/cw+1);
			y1=(int)((sy+sh-1)/ch+1);
			CMoverGroup* mg=GetGroup(MYSHIP_GROUP);
			CMover* myship;
			if (myship=mg->FirstUsed()) {
				do {
					CHit hit=myship->Obj3D->GetHit(HIT_CORE);
					hit.SetPos(myship->X, myship->Y);
					for (int i=y0; i<=y1; i++) {
						for (int j=x0; j<=x1; j++) {
							CObject3D* obj3d=Bg.Chip[Bg.Map[(i%mh+mh)%mh*mw+(j%mw+mw)%mw]];
							if (obj3d && obj3d->GetHit(HIT_CORE).IsHit(j*cw-sx, i*ch-sy, hit)) {
								myship->Damage.Vit-=Damage.Str;
							}
						}
					}
				} while (myship=mg->NextUsed());
			}
		}
*/
	},
	
	Update:function ( )
	{					
		if ( !this.Dead ) 
		{
			// 스치기
			if ( this.Valid.Graze ) 
			{
/*					
				CMoverGroup* bg=GetGroup(BULLET_GROUP);
				CMover *bullet, *effect;
				CHit hit=Obj3D->GetHit(HIT_CORE);
				hit.SetPos(X, Y);
				Graze.Grazing=false;
				if (bullet=bg->FirstHit(&hit))
				{
					do 
					{
						effect=New(Graze.Effect);
						effect->X=bullet->X;
						effect->Y=bullet->Y;
						Graze.Grazing=true;
					} while (bullet=bg->NextHit(&hit));
				}
 */				
			}
	
			// Ground Interference
			var 	vx = this.VX;
			var		vy = this.VY;
/*				
			if (GroundHit.HitX) 
			{
				if (GroundHit.ModeX==GR_ALONG) 
				{
					vx=0; 
				}
				else if (GroundHit.ModeX==GR_REFLECT)
				{
					VX=vx=-vx;
				}
			}
			if (GroundHit.HitY) 
			{
				if (GroundHit.ModeY==GR_ALONG) 
				{
				 	vy=0; 
				}
				else if (GroundHit.ModeY==GR_REFLECT)
				{
				 	VY=vy=-vy;
				}
			}
*/
					
			// Move
			if ( this.Prec ) 
			{
				this.X = this.PrecHist.X;
				this.Y = this.PrecHist.Y;
				this.Yaw.Pos = this.PrecHist.Yaw;
				this.Roll.Pos = PrecHist.Roll;
			} 			
			else if ( this.Valid.Player )
			{
				msw.UpdatePlayer ( this );
			} 
			else if ( this.Valid.Homing ) 
			{
/*				
				if ( Homing.Simple )
				{
				 	MoveSimpleHoming();
				} 
				else
				{
				 	MoveHoming();
				}
*/				
			} 
			else if ( this.Valid.Looping ) 
			{
//				MoveLooping(); 
			}			
			else if ( this.Valid.Aiming || this.Valid.Directed )
			{				
				if ( this.Valid.DDA ) 
				{
					this.UpdateDDA ( );
				}
				else if ( this.Valid.FPN ) 
				{
					this.UpdateFPN ( );
				} 
				else if ( this.Valid.INTG ) 
				{
					this.UpdateINTG ( );
				} 
				else 
				{
					this.X += vx;
					this.Y += vy;
				}				
			}			
			// Scroll
			else if ( this.Valid.BG ) 
			{
/*				
				if (Valid.BgRotate) 
				{
					float rad=D3DX_PI*2*BgRotate.Angle;
					float c=cos(rad), s=sin(rad);
					Bg.SX+= c*Bg.SVX+s*Bg.SVY;
					Bg.SY+=-s*Bg.SVX+c*Bg.SVY;
				} 
				else 
				{
					Bg.SX+=Bg.SVX;
					Bg.SY+=Bg.SVY;
				}
*/
			} 
			else if ( this.Valid.Orbit ) 
			{
/*				
				VX=Orbit.Data[Orbit.Index].VX*Orbit.XMul;
				VY=Orbit.Data[Orbit.Index].VY*Orbit.YMul;
				X+=VX;
				Y+=VY;
				Orbit.Time++;
				if (Orbit.Time>=Orbit.Data[Orbit.Index].Time) 
				{
					Orbit.Time=0;
					Orbit.Index++;
					if (Orbit.Index>=Orbit.Count) 
					{
						if (Orbit.Repeat) 
						{
							Orbit.Index=0; else Orbit.Index=Orbit.Count-1;
						}
					}
				}
*/				
			}
			
			// Yaw
			if ( this.Valid.Yaw && !this.Prec ) 
			{
				if ( this.Yaw.Auto )  
				{					
					this.Yaw.Pos = Math.atan2 ( vx, vy ) / Math.PI * 0.5;									
				} 
				else 
				{
					this.Yaw.Pos += this.Yaw.Speed;
				}
			}
			
			// Roll
			if ( this.Valid.Roll ) 
			{
/*				
				if (Roll.Auto) 
				{
					if (Roll.OnVX) 
					{
						if (Roll.Plus) 
						{
							if (vx<0 && -Roll.Max<=Roll.Pos) 
							{
								Roll.Pos-=Roll.Speed;
							} 
							else if (vx>0 && Roll.Pos<=Roll.Max) 
							{
								Roll.Pos+=Roll.Speed;
							}
						}
						else 
						{
							if (vx>0 && -Roll.Max<=Roll.Pos) 
							{
								Roll.Pos-=Roll.Speed;
							} 
							else if (vx<0 && Roll.Pos<=Roll.Max)
							{
							 	Roll.Pos+=Roll.Speed;
							}
						}
					} 
					else 
					{
						if (Roll.Plus) 
						{
							if (vy<0 && -Roll.Max<=Roll.Pos) 
							{
								Roll.Pos-=Roll.Speed;
							} 
							else if (VY>0 && Roll.Pos<=Roll.Max) 
							{
								Roll.Pos+=Roll.Speed;
							}
						}
						else 
						{
							if (vy>0 && -Roll.Max<=Roll.Pos)
							{
							 	Roll.Pos-=Roll.Speed;
							} 
							else if (vy<0 && Roll.Pos<=Roll.Max)
							{
							 	Roll.Pos+=Roll.Speed;
							}
						}
					}
				} 
				else 
				{
					Roll.Pos+=Roll.Speed;
				}
*/				
			}
/*
			// 가속도
			if (Accel!=0 && Speed!=0) 
			{
				VX/=Speed; VY/=Speed;
				Speed+=Accel;
				VX*=Speed; VY*=Speed;
			}
			VX+=AX; VY+=AY;
*/
			// Scale
			if ( this.Valid.Scale ) 
			{
				var 	sx = this.Scale.X += this.Scale.VX;
				var 	sy = this.Scale.Y += this.Scale.VY;
				if ( this.Sprite ) 
				{
					var		hit = this.Frame.GetHit ( msw.HIT_CORE );
					
					this.Damage.Hit.l = hit.l * sx;
					this.Damage.Hit.r = hit.r * sx;
					this.Damage.Hit.b = hit.b * sy;
					this.Damage.Hit.t = hit.t * sy;
				}
			}

			// Alpha
			this.Alpha.X += this.Alpha.V;
			/*
			// 이력
			if (HistIndex>=0)
			{
				HIST* hpre=&Hists[(HistIndex-1+MAX_HISTS)%MAX_HISTS];
				if (!Valid.Option || hpre->X!=X || hpre->Y!=Y) 
				{
					HIST* hist=&Hists[HistIndex];
					hist->X=X;
					hist->Y=Y;
					hist->Yaw=Yaw.Pos;
					hist->Roll=Roll.Pos;
					hist->Valid=!Prec || (Prec && PrecHist.Valid);
					HistIndex=(HistIndex+1)%MAX_HISTS;
				}
			}
*/
			// Next State
			if ( this.Valid.Next ) 
			{
				if ( this.Next.Timer == 0 ) 
				{
					if ( this.Next.Model ) 
					{
						this.GoNext ( this.Next.Model );
					} 
					else 
					{
						this.Dead = true;
					}
				} 
				else 
				{
					this.Next.Timer--;
				}
			}

			// Captor
			if ( this.Valid.Captor ) 
			{
/*				
				if (Captor.State==CPT_NORMAL) 
				{
					CMoverGroup* mg=GetGroup(MYSHIP_GROUP);
					CMover* m=mg->GetRandomUsedMover();
					if (m) 
					{
						if (!m->Captee.Doubled) 
						{
							New(Captor.Attack);
						}
					}
				}
*/
			}
			
			// Damage
			if ( this.Damage.Vit <= 0 ) 
			{
				if ( this.Damage.SpawnModel ) 
				{
					this.Create ( this.Damage.SpawnModel );
				}
				if ( this.Damage.NextModel ) 
				{
					this.GoNext ( Damage.NextModel );
				} 
				else 
				{
					this.Dead = true;
				}

				if ( this.Valid.Collision ) 
				{
/*				
					CMoverGroup* g=GetGroup(STAGE_GROUP);
					g->IncCollisionEnergy();
					if (g->GetCollisionEnergy()>Collision.MinEnergy) 
					{
						New(Collision.Crash);
					}
*/					
				}
				
				// Captee
				if ( this.Valid.Captee ) 
				{
/*				
					CMoverGroup* eg=GetGroup(ENEMY_GROUP);
					CMover* e=eg->GetRandomUsedMover();
					if (e) 
					{
						e->Captor.State=CPT_CAPTURED;
						e->Captor.MyShip=Obj3D;
					}
*/					
				}
/*
				// 메인 캐릭터를 사로잡은 적기
				if ( this.Valid.Captor && Captor.State==CPT_CAPTURED) 
				{
					CMoverGroup* mg=GetGroup(MYSHIP_GROUP);
					CMover* m=mg->GetRandomUsedMover();
					if (m) 
					{
						m->Captee.Doubled=true;
					}
				}
 */
			}

			// Check Deadzone
			if ( this.Sprite ) 
			{
				var		hit = this.Frame.GetHit ( msw.HIT_ALL );
				var		deadzone = this.Group.GetDeadzoneHit ( );
				
				if ( !hit.IsHit ( this.X, this.Y, deadzone ) )
				{					
				 	this.Dead = true;
				}
			}
			
			if ( this.Prec && this.Prec.Dead ) 
			{
				Dead = true;
			}		
			else
			{
				// Spwan
				for ( var i = 0; i < this.NumSpawns; i++ )
				{
					var 	spawn = this.Spawns [ i ];

					if ( spawn.Count != 0 )
					{
						if ( spawn.Timer == 0 )
						{
							if ( spawn.Count > 0 )
							{
								spawn.Count--;
							}
							spawn.Timer = spawn.Cycle;						
							if ( spawn.NWayCount > 0 ) 
							{
								this.SpawnNWay ( spawn );
							}
							else if ( spawn.CircleCount > 0 )
							{
								this.SpawnCircle ( spawn ); 
							}
							else							
							{
								var 	obj = this.Create ( spawn.Model );
								if ( obj ) 
								{								
									obj.RX = spawn.RX;
									obj.RY = spawn.RY;
								}
							}
						}
						else 
						{
							spawn.Timer--;
						}
					}
				}
			}
		}

		// Remove Dead Object
		if ( this.Dead && this.RefCount == 0 )
		{			
			if ( this.Prec )
			{
				Prec.RefCount--;
			}			
			if ( this.Valid.Homing )
			{
//				Homing.Target.RefCount--;
			}
			if ( this.Valid.Looping )
			{
//				Looping.Target.RefCount--;
			}
			this.Group.Remove ( this );
		}		
	},
	
	PostUpdate:function ( )
	{
		if ( this.Valid.FollowParent )
		{
/*			
			X=Parent->X+RX;
			Y=Parent->Y+RY;
			if (Parent->Damage.Vit<=0) {
				Damage.Vit=0;
				Parent->RefCount--;
			}
*/
		}		
		
		if ( this.Used && this.Sprite )
		{
			this.Sprite.x = this.X;
			this.Sprite.y = this.Y;					
			this.Sprite.rotation = cc.radiansToDegrees ( this.Yaw.Pos * Math.PI * 2 );
			this.Sprite.scaleX = this.Scale.X;
			this.Sprite.scaleY = this.Scale.Y;
			
			if ( this.Alpha.Add )
			{
				// Blend
			}
			
			var		opacity = this.Alpha.X > 1 ? 255 : this.Alpha.X < 0 ? 0 : this.Alpha.X * 255;			
			this.Sprite.opacity = opacity;
			
			if ( this.Valid.Roll )
			{
				var		count = this.Frame.Count ( );
				var		index = parseInt ( this.Roll.Pos + count * 0.5 );
				this.Sprite.setSpriteFrame ( this.Frame.Get ( index ) );		
				
			}			
		}
	},
	
	// Update DDA
	UpdateDDA:function ( )
	{
		// X Axis
		if ( this.DDA.DX >= this.DDA.DY )
		{
			for ( var i = 0; i < this.DDA.Speed; i++ )
			{
				this.DDA.X += this.DDA.VX;

				this.DDA.Diff += this.DDA.DY;
				if ( this.DDA.Diff >= this.DDA.DX )
				{
					this.DDA.Diff -= this.DDA.DX;
					this.DDA.Y += this.DDA.VY;
				}
			}
		} 

		// Y Axis
		else 
		{
			for ( var i = 0; i < this.DDA.Speed; i++ )
			{
				this.DDA.Y += this.DDA.VY;

				this.DDA.Diff += this.DDA.DX;
				if ( this.DDA.Diff >= this.DDA.DY )
				{
					this.DDA.Diff -= this.DDA.DY;
					this.DDA.X += this.DDA.VX;
				}
			}
		}

		this.X = this.DDA.X / 10;
		this.Y = this.DDA.Y / 10;		
	},
	
	// Update FPN
	UpdateFPN:function ( )
	{
		this.FPN.X += this.FPN.VX;
		this.FPN.Y += this.FPN.VY;
		this.X = this.FPN.X / 256;
		this.Y = this.FPN.Y / 256;		
	},
	
	// Update INTG
	UpdateINTG:function ( )
	{
		this.INTG.X += this.INTG.VX;
		this.INTG.Y += this.INTG.VY;
		this.X = this.INTG.X / 10;
		this.Y = this.INTG.Y / 10;			
	},
	
	// Next
	GoNext:function ( Model )
	{
		
		/*
		if ( Model && Model.Frame && this.Sprite )
		{
			cc.log ( Model.FrameName );
			this.Sprite.setSpriteFrame ( Model.Frame );
		}
		*/
		
		
		this.Accel		= Model.Accel;
		this.AX			= Model.AX;
		this.AY			= Model.AY;
		this.Alpha.V	= Model.Alpha.V;
		if ( Model.Valid.Yaw )
		{
			Yaw.Speed = Model.Yaw.Speed;
		}
		if ( Model.Valid.Roll )
		{
			Roll.Speed = Model.Roll.Speed;
		}
		this.NextModel = Model.Next.Model;
		this.NextTimer = Model.Next.Timer;
		if ( Model.Valid.Homing )
		{
			Homing.Angle = Model.Homing.Angle;
		}
		this.Damage.Transparent = Model.Damage.Transparent;		
	},
	
	AddSpawn:function ( Model, Timer, Cycle, Count, RX, RY )
	{
		if ( RX === undefined )	RX = 0;
		if ( RY === undefined )	RY = 0;
		
		var		Spawn = this.Spawns [ this.NumSpawns++ ];
	
		Spawn.Model 		= Model;
		Spawn.Timer 		= Timer;
		Spawn.Cycle 		= Cycle;
		Spawn.Count 		= Count;
		Spawn.NWayCount 	= 0;
		Spawn.CircleCount 	= 0;
		Spawn.RX 			= RX;
		Spawn.RY 			= RY;	
	},
	
	AddSpawnNWay:function ( Model, Timer, Cycle, Count, NWayCount, NWayAngle )
	{
		var		Spawn = this.Spawns [ this.NumSpawns++ ];

		Spawn.Model 		= Model;
		Spawn.Timer 		= Timer;
		Spawn.Cycle 		= Cycle;
		Spawn.Count 		= Count;
		Spawn.NWayCount 	= NWayCount;
		Spawn.NWayAngle		= NWayAngle;
		Spawn.CircleCount 	= 0;	
	},
	
	AddSpawnCircle:function ( Model, Timer, Cycle, Count, CircleCount, CircleOdd )
	{
		var		Spawn = this.Spawns [ this.NumSpawns++ ];

		Spawn.Model 		= Model;
		Spawn.Timer 		= Timer;
		Spawn.Cycle 		= Cycle;
		Spawn.Count 		= Count;
		Spawn.NWayCount 	= 0;
		Spawn.CircleCount 	= CircleCount;
		Spawn.CircleOdd		= CircleOdd;
	},	

	GetRandomPlayer:function ( )
	{
		return this.Group.GetManager ( ).GetGroup ( msw.GROUP_PLAYER ).GetRandomUsedObject ( );
	},
	
	// Bullet
	SetAiming:function ( Speed, Angle )
	{
		this.Valid.Aiming = true;
		this.Speed = Speed;
		this.Angle = Angle;
	},

	SetAimingDDA:function ( Speed, Angle )
	{
		this.Valid.DDA = true;
		this.SetAiming ( Speed, Angle );
	},
	
	SetAimingFPN:function ( Speed, Angle )
	{
		this.Valid.FPN = true;
		this.SetAiming ( Speed, Angle );
	},
	
	SetDirected:function ( Speed, Angle )
	{
		this.Valid.Directed = true;
		this.Speed = Speed;
		this.Angle = Angle;
	},
	
	SetDirected16_30:function ( Speed, Angle )
	{
		this.Valid.INTG = true;
		this.SetDirected ( Speed, Angle );
	},
	
	SetDirectedDDA:function ( Speed, Angle )
	{
		this.Valid.DDA = true;
		this.SetDirected ( Speed, Angle );
	},
	
	// Roll
	SetRoll:function ( Speed )
	{
		this.Valid.Roll = true;
		this.Roll.Pos 	= 0;
		this.Roll.Speed = Speed;
		this.Roll.Auto  = false;		
	},

	SetAutoRoll:function ( Max, Speed, OnVX, Plus )
	{
		if ( OnVX === undefined )
		{
			OnVX = true;
		}
		
		if ( Plus === undefined )
		{
			Plus = true;
		}
		
		this.Valid.Roll = true;
		this.Roll.Pos 	= 0;
		this.Roll.Max 	= Max;
		this.Roll.Speed = Speed;
		this.Roll.OnVX 	= OnVX;
		this.Roll.Plus 	= Plus;	
		this.Roll.Auto	= true;
	},	

	// Yaw
	SetYaw:function ( Speed )
	{
		this.Valid.Yaw 	= true;
		this.Yaw.Pos   	= 0;
		this.Yaw.Speed 	= Speed;
		this.Yaw.Auto  	= false;	
	},

	SetAutoYaw:function ( )
	{
		this.Valid.Yaw 	= true;
		this.Yaw.Pos 	= 0;
		this.Yaw.Speed 	= 0;
		this.Yaw.Auto	= true;
	},	
	
	// Position
	SetPos:function ( X, Y )
	{
		this.Valid.Pos = true;
		this.Pos.X = X;
		this.Pos.Y = Y;
	},
	
	// Scale
	SetScale:function ( SX, SY, SVX, SVY )
	{
		this.Valid.Scale	= true;
		this.Scale.X		= SX;
		this.Scale.Y		= SY;
		this.Scale.VX		= SVX;
		this.Scale.VY		= SVY;		
	},
	
	// Alpha
	SetAlpha:function ( Alpha, AlphaV )
	{
		this.Alpha.X = Alpha; 
		this.Alpha.V = AlphaV;	
	},
	
	// Frame
	SetFrame:function ( FrameName )
	{		
		for ( var i in msw.Frames )
		{
			if ( FrameName == msw.Frames [ i ].Key )
			{
				this.Frame = msw.Frames [ i ].Frame;
				break;
			}
		}
				
		if ( this.Frame )
		{
			this.Damage.Hit = this.Frame.GetHit ( msw.HIT_CORE );			
		}
	},
	
	SetDamage:function ( Str, Vit, SpawnModel, NextModel, Invincible, Transparent, TargetOnly )
	{
		this.Damage.Str			= Str;
		this.Damage.Vit			= Vit;
		this.Damage.SpawnModel	= SpawnModel;
		this.Damage.NextModel	= NextModel;
		this.Damage.Invincible	= Invincible;
		this.Damage.Transparent	= Transparent;
		this.Damage.TargetOnly	= TargetOnly;
	},	
	
	SetNext:function ( Model, Timer )
	{
		this.Valid.Next	= true;
		this.Next.Model	= Model;
		this.Next.Timer	= Timer;
	},
	
	// Player
	SetPlayer:function ( ID, X, Y, Speed )
	{
		this.Valid.Player 	= true;
		this.Player.ID 		= ID;
		this.Player.X 		= X;
		this.Player.Y 		= Y;
		this.Speed 			= Speed;
	},	
	
	InitAiming:function ( TX, TY, Speed, Angle )
	{
		var 	vx = TX - this.X;
		var		vy = TY - this.Y;
		var 	d  = Math.sqrt ( vx*vx + vy*vy );

		if ( d > 0 )
		{
			vx *= this.Speed / d; 
			vy *= this.Speed / d;
		}
		else 
		{
			vx = 0;
			vy = -this.Speed;
		}

		var 	rad  = Math.PI * 2 * this.Angle;
		var 	cosr = Math.cos ( rad );
		var		sinr = Math.sin ( rad );

		this.VX = cosr * vx - sinr * vy;
		this.VY = sinr * vx + cosr * vy;	

//		cc.log ( "x " + this.VX + " y " + this.VY + " A " + this.Angle );
	},
	
	// Aiming 
	InitAimingDDA:function ( FTX, FTY, FSpeed )
	{		
		var 	x 		= parseInt ( this.X * 10 );
		var		y		= parseInt ( this.Y * 10 ); 
		var		tx 		= parseInt ( FTX 	* 10 );
		var		ty 		= parseInt ( FTY 	* 10 );
		var		speed	= parseInt ( FSpeed * 10 );
		
		// Init
		this.DDA.X = x; 
		this.DDA.Y = y;
		this.DDA.Speed = Math.max ( speed, 1 );

		// Direction
		var 	vx = this.DDA.VX = tx > x ? 1 : -1;
		var 	vy = this.DDA.VY = ty > y ? 1 : -1;

		// Absolute Distance
		var 	dx = this.DDA.DX = tx >= x ? tx - x : x - tx;
		var 	dy = this.DDA.DY = ty >= y ? ty - y : y - ty;

		// Difference
		this.DDA.Diff = parseInt ( dx >= dy ? dx / 2 : dy / 2 );

		this.VX = vx * dx / 100;
		this.VY = vy * dy / 100;		
	},

	InitAimingFPN:function ( FTX, FTY, FSpeed )
	{
		var 	x 		= parseInt ( this.X * 256 );
		var		y		= parseInt ( this.Y * 256 ); 
		var		tx 		= parseInt ( FTX 	* 256 );
		var		ty 		= parseInt ( FTY 	* 256 );
		var		speed	= parseInt ( FSpeed * 256 );

		// Init
		this.FPN.X = x; 
		this.FPN.Y = y;

		// Absolute Distance
		var 	dx = tx >= x ? tx - x : x - tx;
		var 	dy = ty >= y ? ty - y : y - ty;
		
		// Distance
		var 	d = dx >= dy ? dx : dy;

		// Calc Speed (IVX,IVY)
		var 	vx = this.FPN.VX = parseInt ( ( tx - x ) * speed / d );
		var 	vy = this.FPN.VY = parseInt ( ( ty - y ) * speed / d );	

		this.VX = vx / 256;
		this.VY = vy / 256;
	},

	// Directed
	InitDirected:function ( Speed, Angle )
	{
		this.VX = Math.sin ( Math.PI * 2 * this.Angle ) * this.Speed;
		this.VY = Math.cos ( Math.PI * 2 * this.Angle ) * this.Speed;
	},	

	// 16 Way, Speed 30
	InitDirected16_30:function ( Angle )
	{
		this.INTG.X = parseInt ( this.X * 10 );
		this.INTG.Y = parseInt ( this.Y * 10 );
		
		// Direction
		var 	dir = ( parseInt ( this.Angle * 16 ) % 16 + 16 ) % 16;

		// VX, VY
		this.INTG.VX = msw.TableV3 [ dir ][ 0 ] * 10;
		this.INTG.VY = msw.TableV3 [ dir ][ 1 ] * 10;

		this.VX = this.INTG.VX / 10;
		this.VY = this.INTG.VY / 10;		
	},
	
	// DirectedDDA
	InitDirectedDDA:function ( Speed, Angle )
	{
		if ( msw.TableDDA == null )
		{
			msw.TableDDA = [];
			for ( var i = 0; i < 360; i++ )
			{
				msw.TableDDA [ i ] = 
				[
				 	parseInt ( Math.cos ( Math.PI * 2 * i ) * 1000 ), 
				 	parseInt ( Math.sin ( Math.PI * 2 * i ) * 1000 ) 
				];				
			}
		}
		
		// Direction
		var 	dir = ( parseInt ( this.Angle * 360 ) % 360 + 360 ) % 360;		

		var 	tx = msw.TableDDA [ dir ][ 0 ];
		var 	ty = msw.TableDDA [ dir ][ 1 ];

		// Init AminingDDA
		this.InitAimingDDA ( tx, ty, Speed );
	},	
	
	// Spawn
	SpawnNWay:function ( Spawn )
	{
		var 	Count 		= Spawn.NWayCount;
		var		SpaceAngle 	= Spawn.NWayAngle;
//		var 	Angle		= Count % 2 ? ( -Count / 2 ) * SpaceAngle : ( -Count / 2 + 0.5 ) * SpaceAngle;
		var 	Angle		= ( -Count / 2 + 0.5 ) * SpaceAngle;
		var 	Model		= msw.Clone ( Spawn.Model );
		var 	ModelAngle 	= Model.Angle;
		
		for ( var i = 0; i < Count; i++, Angle += SpaceAngle )
		{
			Model.Angle = ModelAngle + Angle;
			this.Create ( Model );
		}			
	},
	
	SpawnCircle:function ( Spawn )
	{
		var 	Count 		= Spawn.CircleCount;
		var 	Odd 		= Spawn.CircleOdd;
		var 	SpaceAngle 	= 1.0 / Count;
		var 	Angle		= Odd ? 0 : SpaceAngle / 2;
		var 	Model		= msw.Clone ( Spawn.Model );
		var 	ModelAngle 	= Model.Angle;
		
		for ( var i = 0; i < Count; i++, Angle += SpaceAngle )
		{
			Model.Angle = ModelAngle + Angle;
			this.Create ( Model );
		}
	},
});