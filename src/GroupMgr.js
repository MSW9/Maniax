msw.GROUP_PLAYER		= 0;
msw.GROUP_WEAPON		= 1;
msw.GROUP_ENEMY			= 3;
msw.GROUP_BULLET		= 2;
msw.GROUP_STAGE			= 4;
msw.GROUP_GROUND		= 5;
msw.GROUP_ITEM			= 6;
msw.GROUP_WATER			= 7;
msw.GROUP_BARRIER		= 8;
msw.GROUP_GROUND_ENEMY	= 9;
msw.GROUP_BG			= 10; 
msw.GROUP_JOINT			= 11;
msw.GROUP_COUNT			= 12;

msw.DEBUG_BG			= 1;

// Object Group Manager
msw.GroupMgr = cc.Layer.extend
({
	ctor:function ( )
	{
		this._super ( );
				
		this.Groups	= [];		
				
		this.Groups [ msw.GROUP_PLAYER		 ] = new msw.Group ( this,   20 );
		this.Groups [ msw.GROUP_WEAPON		 ] = new msw.Group ( this,  300 );
		this.Groups [ msw.GROUP_ENEMY		 ] = new msw.Group ( this,  300 );
		this.Groups [ msw.GROUP_BULLET		 ] = new msw.Group ( this, 1000 );
		this.Groups [ msw.GROUP_STAGE		 ] = new msw.Group ( this,  300 );
		this.Groups [ msw.GROUP_GROUND		 ] = new msw.Group ( this,  300 );
		this.Groups [ msw.GROUP_ITEM		 ] = new msw.Group ( this,  300 );
		this.Groups [ msw.GROUP_WATER		 ] = new msw.Group ( this,  300 );
		this.Groups [ msw.GROUP_BARRIER		 ] = new msw.Group ( this,   20 );
		this.Groups [ msw.GROUP_GROUND_ENEMY ] = new msw.Group ( this,  300 );
		this.Groups [ msw.GROUP_BG			 ] = new msw.Group ( this,   20 );
		this.Groups [ msw.GROUP_JOINT		 ] = new msw.Group ( this,  100 );	
		
		for ( var i = 0; i < msw.GROUP_COUNT; i++ ) 
		{
			this.addChild ( this.Groups [ i ] );
		}		
		
		if ( msw.DEBUG_BG == 1 )
		{
			this.DebugBG = new cc.LayerColor ( cc.color ( 0, 0, 0, 255 ) );
			this.addChild ( this.DebugBG, -1 );		
			
			this.DebugDeadBG = new cc.LayerColor ( cc.color ( 128, 0, 0, 255 ) );
			this.addChild ( this.DebugDeadBG, -2 );				
		}
	},
	
	Check:function ( )
	{
		for ( var i = 0; i < msw.GROUP_COUNT; i++ ) 
		{
			this.Groups [ i ].Check ( );
		}
		
		this.Groups [ msw.GROUP_PLAYER	].CheckDamage ( this.Groups [ msw.GROUP_ENEMY		 ], msw.DAMAGE_BOTH );
		this.Groups [ msw.GROUP_PLAYER	].CheckDamage ( this.Groups [ msw.GROUP_JOINT		 ], msw.DAMAGE_TAKE );
		this.Groups [ msw.GROUP_PLAYER	].CheckDamage ( this.Groups [ msw.GROUP_BULLET		 ], msw.DAMAGE_TAKE );
		this.Groups [ msw.GROUP_PLAYER	].CheckDamage ( this.Groups [ msw.GROUP_GROUND		 ], msw.DAMAGE_TAKE );
		this.Groups [ msw.GROUP_WEAPON	].CheckDamage ( this.Groups [ msw.GROUP_ENEMY		 ], msw.DAMAGE_BOTH );
		this.Groups [ msw.GROUP_WEAPON	].CheckDamage ( this.Groups [ msw.GROUP_GROUND_ENEMY ], msw.DAMAGE_BOTH );
		this.Groups [ msw.GROUP_BARRIER ].CheckDamage ( this.Groups [ msw.GROUP_ENEMY		 ], msw.DAMAGE_BOTH );
		this.Groups [ msw.GROUP_BARRIER ].CheckDamage ( this.Groups [ msw.GROUP_BULLET		 ], msw.DAMAGE_BOTH );
		this.Groups [ msw.GROUP_BARRIER ].CheckDamage ( this.Groups [ msw.GROUP_JOINT		 ], msw.DAMAGE_TAKE );		
	},
	
	Update:function ( )
	{
		for ( var i = 0; i < msw.GROUP_COUNT; i++ ) 
		{
			this.Groups [ i ].Update ( );
		}
		
		for ( var i = 0; i < msw.GROUP_COUNT; i++ ) 
		{
			this.Groups [ i ].PostUpdate ( );
		}	
	},
	
	Clear:function ( )
	{
		for ( var i = 0; i < msw.GROUP_COUNT; i++ )
		{
			this.Groups [ i ].Clear ( );			
		}		
	},
	
	SetScreenHit:function ( Hit )
	{			
		for ( var i = 0; i < msw.GROUP_COUNT; i++ )
		{
			this.Groups [ i ].SetScreenHit ( Hit );
		}
		
		// Debug
		if ( this.DebugBG )
		{
			this.DebugBG.x = Hit.l;
			this.DebugBG.y = Hit.b;
			this.DebugBG.width  = Hit.r - Hit.l;
			this.DebugBG.height = Hit.t - Hit.b;
		}
	},
	
	SetDeadzoneHit:function ( Hit )
	{
		for ( var i = 0; i < msw.GROUP_COUNT; i++ )
		{
			this.Groups [ i ].SetDeadzoneHit ( Hit );
		}
		
		// Debug
		if ( this.DebugDeadBG )
		{
			this.DebugDeadBG.x = Hit.l;
			this.DebugDeadBG.y = Hit.b;
			this.DebugDeadBG.width  = Hit.r - Hit.l;
			this.DebugDeadBG.height = Hit.t - Hit.b;
		}			
	},
	
	GetGroup:function ( ID )
	{
		return this.Groups [ ID ];
	},
});

/*
//==============================================================
//촉수, 다관절 관련

#define MAX_JOINT 100

//촉수, 다관절
class CJointMover : public CMover {
	protected:

		// 촉수，다관절
		typedef struct {

		// 공통
		CMover *Mover[MAX_JOINT], *HeadModel, *BodyModel, *RootModel;
		int NumPart;

		// 촉수
		int NumLoop;
		float MaxDist;

		// 다관절
		CMover *Target;
		float Rad[MAX_JOINT], CRad, VRad, LRad, Dist;

	} JOINT;
	JOINT Joint;

	public:

		CJointMover(CMoverGroup* group);
	void Init(CMover* model_joint, CMover* parent);
	void PostMove();

	CJointMover* SetTentacle(
			CMover* head, CMover* body, CMover* root, 
			int num_part, int num_loop, float max_dist);
	CJointMover* SetJoint(
			CMover* head, CMover* body, CMover* root, 
			int num_part, float center_angle, float vangle, float limit_angle, float dist);

};


//촉수, 다관절 그룹
class CJointMoverGroup : public CMoverGroup {
	public:
		CJointMoverGroup(CMoverGroupManager* manager, LPDIRECT3DDEVICE9 device, int num_all_movers);
~CJointMoverGroup();
};


//==============================================================
//배경 관련

#define MAX_STARS 100

//별의 정점형식
typedef struct {
	FLOAT X, Y, Z, RHW;
	D3DCOLOR Color;
} STAR_VERTEX;

//독자적인 정점형식을 나타내는 FVF
#define D3DFVF_STAR_VERTEX D3DFVF_XYZRHW|D3DFVF_DIFFUSE


//배경
class CBgMover : public CMover {
	protected:

		// 별
		struct {
		float X[MAX_STARS], Y[MAX_STARS];
		float X0, Y0, X1, Y1;
		CObject3D* Obj3D;
		int Num, MinARGB, MaxARGB;
		D3DCOLOR Color[MAX_STARS];
	} Star;

	public:
		CBgMover(CMoverGroup* group);
	void Init(CMover* model_bg, CMover* parent);
	void Move();
	void Draw();

	CBgMover* SetStar(
			float vx, float vy, float z_0to1, int num, 
			int min_argb, int max_argb);
	CBgMover* SetStar(
			CObject3D* obj3d, 
			float x0, float y0, float x1, float y1, 
			float vx, float vy, float z, int num);
};
*/