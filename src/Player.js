msw.UpdatePlayer = function ( Player )
{	
	var		Input = Player.Group.GetInput ( );	
	if ( !Input )
	{
		return;
	}
	
	var		Is  	= Input.GetState ( Player.Player.ID );
	var 	AllHit 	= Player.Frame.GetHit ( msw.HIT_ALL );
	var		ScrHit 	= Player.Group.GetScreenHit ( );
	var		X   	= Player.X;
	var		Y		= Player.Y;
	
	// Transform
	if ( Player.Valid.Transform )
	{
/*
		bool button=is->Button[Transform.ButtonID];
		if (!Transform.PrevButton && button) {
			Dead=true;
			New(Transform.Effect);
			CMover* mover=New(Transform.Model);
			if (mover) {
				mover->X=X;
				mover->Y=Y;
				mover->Transform.PrevButton=true;
			}
		}
		Transform.PrevButton=button;
 */		
	}


	// Control Speed By Button
	if ( Player.Valid.SCButton ) 
	{
/*			
		// 버튼을 한 번 떼었다가 눌렀을 경우:
		// 속도 조절을 실시함.
		if (!SCButton.PrevButton && is->Button[SCButton.ButtonID]) {
			if (Speed>=SCButton.MaxSpeed) Speed=SCButton.MinSpeed;
			else Speed+=SCButton.Accel;
		}

		SCButton.PrevButton=is->Button[SCButton.ButtonID];
*/		
	}
/*
	// 아이템
	var 		IG = Player.Group.GetManager ( ).GetGroup ( msw.GROUP_ITEM );
	CMover* 	Item;
	Hit 		CoreHit = Player.GetHit ( );
	CoreHit.SetPos ( X, Y );
	if ( Item = IG.FirstHit ( CoreHit ) )
	{
		do {
			item->Dead=true;

			// 스피드 조절
			if (Valid.SCItem) {
				Speed+=item->ItemEffect.Accel;
				if (Speed>SCItem.MaxSpeed) Speed=SCItem.MaxSpeed;
				if (Speed<SCItem.MinSpeed) Speed=SCItem.MinSpeed;
			}

			// 합체
			if (Valid.Docking && !Docking.Docked) {
				Docking.Docked=true; 
				//ItemEffect.Docking;
				Damage.Hit=Docking.Docked?
						Docking.Obj3D->GetHit(HIT_CORE):
							Obj3D->GetHit(HIT_CORE);
			}

			// 특수 공격:
			// 보통 상태일 때 아이템을 얻으면，
			// 특수 상태로 이동하여, 남은 시간을 설정함.
			if (Valid.SAItem) {
				if (!SAItem.EffectMover) {
					SAItem.Time=SAItem.MaxTime;
					SAItem.EffectMover=New(SAItem.EffectModel);
				}
			}

			// 버서크:
			// 에너지가 충분히 모이면
			// 버서크 상태로 이동함.
			if (Valid.Berserk && Berserk.State==BS_NORMAL) {
				Berserk.Energy++;
				if (Berserk.Energy>=Berserk.ReqEnergy) {
					Berserk.State=BS_BERSERK;
					Berserk.EffectMover=New(Berserk.EffectModel);
					Berserk.Time=Berserk.MaxTime;
					Berserk.Energy=0;
				}
			}

		} while (item=ig->NextHit(&core_hit));
	}
*/

	// Rotate Background
	if ( Player.Valid.BGRotate ) 
	{
/*			
		float vangle=BgRotate.Angle*is->AnalogX;
		CMoverGroup* sg=GetGroup(STAGE_GROUP);
		CMover* bg;
		if (bg=sg->FirstUsed()) {
			do {
				if (bg->Valid.BgRotate) bg->BgRotate.Angle-=vangle;
			} while (bg=sg->NextUsed());
		}
 */		
	} 
	// Warp
	else if ( Player.Valid.Warp ) 
	{
/*		
		int input=
			(is->Up?CMD_UP:0)|
			(is->Down?CMD_DOWN:0)|
			(is->Left?CMD_LEFT:0)|
			(is->Right?CMD_RIGHT:0);
		if (input) {

			// 워프할 경우:
			// 제한 시간 이내에 같은 방향으로 두 번 입력했을 경우.
			// (단, 첫번째 입력과 두번째 입력 사이에 무입력 상태가 필요)
			if (Warp.Released && Warp.Time>0 && 
					Warp.Input==input
			) {
				// 워프의 시각효과
				if (Warp.Effect) New(Warp.Effect);

				// 워프 이동하기
				float new_y=Y+Warp.Distance*is->AnalogY;
				if (all_hit.IsInside(x, new_y, screen_hit)) Y=new_y;
				float new_x=X+Warp.Distance*is->AnalogX;
				if (all_hit.IsInside(new_x, y, screen_hit)) X=new_x;				
			}

			// 워프하지 않을 경우:
			// 무입력 상태가 없었던지, 제한시간 이내에 입력하지 못했던지，
			// 첫번째 입력과 다른 방향으로 입력했을 경우.
			else {

				// 방향을 기록하고 제한시간을 설정
				Warp.Input=input;
				Warp.Time=Warp.TimeLimit;

				// 그냥 이동함
				float new_y=Y+Speed*is->AnalogY;
				if (all_hit.IsInside(x, new_y, screen_hit)) Y=new_y;
				float new_x=X+Speed*is->AnalogX;
				if (all_hit.IsInside(new_x, y, screen_hit)) X=new_x;
			}

			Warp.Released=false;
		}

		// 스틱이 무입력 상태일 때
		else Warp.Released=true;

		// 제한 시간을 깎음
		if (Warp.Time>0) Warp.Time--;
*/
	}	 
	// Walk
	else if ( Player.Valid.Walk ) 
	{
/*		
		// 상승
		if ( Walk.Time > 0 )
		{
			Walk.Time--;
			X+=Walk.JVX; Y+=Walk.JVY;
		} 
		// 낙하
		else				
		{
			CMoverGroup* gg=GetGroup(GROUND_GROUP);
			CHit hit=Obj3D->GetHit(HIT_ALL);
			float new_x=X+Walk.GVX, new_y=Y+Walk.GVY;
			hit.SetPos(new_x, new_y);
			if (!gg->FirstHit(&hit)) {
				X=new_x; Y=new_y;
			} else {

				// 점프 시작
				if (is->Button[Walk.ButtonID]) Walk.Time=Walk.JumpTime;
			}
		}

		// 좌우 이동
		float new_x=X+Speed*is->AnalogX;
		if (all_hit.IsInside(new_x, y, screen_hit)) X=new_x;
*/
	}
/*		
	// Throw & Thrown
	else if ( Player.Valid.Throw && Player.Throw.Thrown ) 
	{
	
		if ( Throw.Time<=0 )
		{
			Throw.Thrown=false;
		} 
		else 
		{
			Throw.Time--;
			if (!all_hit.IsInside(X, Y+Throw.VY, screen_hit)) Throw.VY=-Throw.VY;
			if (!all_hit.IsInside(X+Throw.VX, Y, screen_hit)) Throw.VX=-Throw.VX;
			X+=Throw.VX;
			Y+=Throw.VY;
			Yaw.Pos+=Throw.VYaw;
		}
	
	} 
 */		
	// Basic Move (Analog/Digital)
	else 
	{
		var 	Speed;

		// 수중 처리
		if ( Player.Valid.Underwater )
		{
/*		
			speed=(Y<Underwater.WaterH?Speed:Underwater.Speed);
			if (Underwater.AirH<=Y && Y<Underwater.WaterH) 
			{
				New(Underwater.Wave);
			}
*/			
		} 
		else
		{
			Speed = Player.Speed;
		}

		// Basic Process
		if ( !Player.Valid.MovableSightB || Player.MovableSightB.State != msw.MSS_SIGHT ) 
		{
	
			var 	VY = Player.Speed * Is.AnalogY;
			var		VX = Player.Speed * Is.AnalogX;

			// Gravity
			if ( Player.Valid.Gravity ) 
			{
//				vx += Gravity.VX;
//				vy += Gravity.VY;
			}
			
			// Move
			var 	NewY = Y + VY;
			var		NewX = X + VX;
			
			if ( AllHit.IsInside ( X, NewY, ScrHit ) )
			{
				Player.Y = NewY;
			}
			if ( AllHit.IsInside ( NewX, Y, ScrHit ) )
			{
				Player.X = NewX;
			}

			// Random Scroll
			if ( Player.Valid.FreeScrollY ) 
			{
/*
				CMoverGroup* sg=GetGroup(STAGE_GROUP);
				CMover* bg;
				if (bg=sg->FirstUsed()) 
				{
					do
					{
						if (bg->Valid.Bg) bg->Bg.SY+=vy;
					} while (bg=sg->NextUsed());
				}
				sg=GetGroup(GROUND_GROUP);
				if (bg=sg->FirstUsed()) 
				{
					do 
					{
						if (bg->Valid.Bg) bg->Bg.SY+=vy;
					} while (bg=sg->NextUsed());
				}
*/
			}		
		}
	}

	// Roll
	if ( Player.Valid.Roll && Player.Roll.Auto && !Player.Valid.Walk && !Player.Valid.BGRotate &&
	  ( !Player.Valid.MovableSightB || Player.MovableSightB.State != msw.MSS_SIGHT ) )
	{
			
		if ( Player.Roll.OnVX )
		{
			if ( Is.Left != Is.Right )
			{
				if ( Is.Left && -Player.Roll.Max < Player.Roll.Pos ) 
				{
					Player.Roll.Pos -= Player.Roll.Speed; 
				}
				else if ( Is.Right && Player.Roll.Pos < Player.Roll.Max )
				{
					Player.Roll.Pos += Player.Roll.Speed;
				}
			}
			else 
			{
				if ( Player.Roll.Pos < 0 )
				{
					Player.Roll.Pos += Player.Roll.Speed; 
				}
				else if ( 0 < Player.Roll.Pos )
				{
					Player.Roll.Pos -= Player.Roll.Speed;
				}
			}
		} 
		else 
		{
			if ( Is.Up != Is.Down )
			{
				if ( Is.Down && -Player.Roll.Max < Player.Roll.Pos )
				{
					Player.Roll.Pos -= Player.Roll.Speed; 
				}
				else if ( Is.Up && Player.Roll.Pos < Player.Roll.Max )
				{
					Player.Roll.Pos += Player.Roll.Speed;
				}
			} 
			else 
			{
				if ( Player.Roll.Pos < 0 )
				{
					Player.Roll.Pos += Player.Roll.Speed;
				}
				else if ( 0 < Player.Roll.Pos )
				{
					Player.Roll.Pos -= Player.Roll.Speed;
				}
			}
		}	
	}

/*
	// 샷
	bool button=is->Button[1];
	if (Valid.Weapon) {
		WEAPON& wp=Weapon;
		switch (Weapon.ID) {
		case WP_BASIC_SHOT:
			BasicShot(button, wp.PrevButton);
			break;
		case WP_AUTO_SHOT:
			AutoShot(button);
			break;
		case WP_POWER_SHOT:
			PowerShot(button, wp.MinPower, wp.MaxPower, wp.Power);
			break;
		case WP_SEMI_AUTO_SHOT:
			SemiAutoShot(button, wp.MinPower, wp.MaxPower, wp.MaxGauge, wp.Power, wp.Gauge);
			break;
		case WP_POWER_SHOT_RELEASED:
			PowerShotReleased(button, wp.MinPower, wp.MaxPower, wp.Power);
			break;
		case WP_SHOT_AND_LASER:
			ShotAndLaser(button, wp.MinPower, wp.MaxGauge, wp.Power, wp.Gauge);
			break;
		case WP_LOCK_SHOT:
			LockShot(button, wp.MinPower, wp.MaxGauge, wp.Power, wp.Gauge);
			break;
		case WP_COMMAND_SHOT:
			CommandShot(is);
			break;
		}
	}
*/

	// 조준을 사용한 폭격
	if ( Player.Valid.SightedBomb )
	{
/*			
		SIGHTED_BOMB& sb=SightedBomb;

		// 폭격중이 아닐 때:
		// 버튼이 눌렸다면 폭격을 함.
		// 폭탄의 초기 좌표와 착탄점의 좌표를 설정.
		if (!sb.Bombing) 
		{
			if (button) 
			{			
				sb.Bombing=true;
				sb.TX=X+sb.SX; sb.TY=Y+sb.SY;
				CMover* mover=sb.Mover=New(sb.Model);
				if (mover) 
				{
					mover->RefCount++;
				}
			}
		}

		// 폭격중일 때;
		// 폭탄이 사라지면 다음 폭탄을 쏠 수 있도록 함.
		else 
		{
			if (sb.Mover->Dead) 
			{
				sb.Mover->RefCount--;
				sb.Bombing=false;
			}
		}
*/		
	}

	// Lock On Laser
	if ( Player.Valid.LockOnLaser ) 
	{
/*			
		LOCKON_LASER& lol=LockOnLaser;
		if (button) {
			for (i=0; i<lol.MaxAvail; i++) {
				if (!lol.LaserMover[i] && lol.TargetMover[i]) {
					CMover* model=lol.LaserModel;
					model->Valid.Target=true;
					model->Target.Type=TG_MOVER;
					model->Target.Mover=lol.TargetMover[i];
					CMover* mover=lol.LaserMover[i]=New(model);
					if (mover) mover->RefCount++;
				}
			}
		}
 */		
	}
	
	// Turn Marker
	if ( Player.Valid.TurnMarker )
	{
/*		
		TURN_MARKER& tm=TurnMarker;

		// 선회 시작:
		// 턴 마커의 좌표를 계산
		if (!tm.Turning && is->Button[tm.ButtonID]) {
			tm.Turning=true;
			tm.MX=X-tm.Dist*cos(D3DX_PI*2*(Yaw.Pos-tm.Yaw));
			tm.MY=Y-tm.Dist*sin(D3DX_PI*2*(Yaw.Pos-tm.Yaw));
		}

		// 선회 종료
		if (!is->Button[tm.ButtonID]) tm.Turning=false;

		// 선회중이면 선회 각도를 계산
		if (tm.Turning) Yaw.Pos=-atan2(X-tm.MX, Y-tm.MY)/D3DX_PI/2;
*/		
	}

	// Barrier 
	if ( Player.Valid.Barrier )
	{
/*	
		CMover* b=Barrier.Mover;
		b->X=X;
		b->Y=Y;
		if (b->Damage.Vit<Barrier.WarnVit) 
			b->Alpha.X=b->Damage.Vit/Barrier.WarnVit;
*/			
	}

	// Close Attack
	if ( Player.Valid.Punch )
	{
/*
		// 근접 공격을 시작
		if (!Punch.Mover && is->Button[Punch.ButtonID]) {
			Punch.Mover=New(Punch.Model);
			Punch.Time=Punch.MaxTime;
		}

		// 근접 공격의 계속과 종료:
		// 지속 시간을 경과하면 근접 공격을 종료함
		if (Punch.Mover) {
			Punch.Mover->X=X;
			Punch.Mover->Y=Y;
			if (Punch.Time==0) {
				Punch.Mover->Dead=true;
				Punch.Mover=NULL;
			} else {
				Punch.Time--;
			}
		}
 */		
	}

	// Arm
	if ( Player.Valid.Arm )
	{
/*			
		switch (Arm.State) 
		{

		// 대기상태:
		// 버튼이 눌리면 집게를 뻗음
		case AS_READY:
			if (is->Button[Arm.ButtonID]) {
				Arm.State=AS_EXTENDING;
				Arm.Length=0;
				Arm.Captured=false;
			}
			break;

			// 뻗고 있는 도중:
			// 집게를 뻗어，
			// 최대 길이에 도달하면 완전히 뻗은 상태로 이동
		case AS_EXTENDING:
			if (Arm.Length<Arm.MaxLength) {
				Arm.Length++;
			} else {
				Arm.State=AS_EXTENDED;
				Arm.Time=Arm.MaxTime;
			}
			break;

			// 완전히 뻗은 상태:
			// 일정한 시간이 경과하면 집게를 다시 집어넣음
		case AS_EXTENDED:
			if (Arm.Time<=0) {
				Arm.State=AS_SHRINKING;
			} else {
				Arm.Time--;
			}
			break;

			// 줄어들고 있는 도중:
			// 길이가 0이 되면 대기상태로 돌아감
		case AS_SHRINKING:
			if (Arm.Length>0) {
				Arm.Length--;
			} else {
				Arm.State=AS_READY;
			}
			break;
		}

		// 집게와 적기의 접촉 판정
		if ((Arm.State==AS_EXTENDING || Arm.State==AS_EXTENDED) && !Arm.Captured) 
		{
			CMoverGroup* eg=GetGroup(ENEMY_GROUP);
			CMover* mover;
			CHit hit=Arm.Head->GetHit(HIT_CORE);
			hit.SetPos(X, Y-Arm.Speed*Arm.Length);
			if (mover=eg->FirstHit(&hit)) 
			{
				do 
				{
					if (Arm.NumStock<Arm.MaxStock) 
					{
						mover->Dead=true;
						Arm.Captured=true;
						Arm.State=AS_SHRINKING;
						Arm.Stock[Arm.NumStock]=mover->Obj3D;
						Arm.NumStock++;
					}
				} while (mover=eg->NextHit(&hit));
			}
		}
*/		
	}

/*	
	// Special Attack
	// 특수상태일 때 남은 시간이 다 되면 통상상태로 돌아감
	if ( Player.Valid.SAItem && Player.SAItem.EffectMover )
	{
		if (SAItem.Time==0) 
		{
			SAItem.EffectMover->Dead=true;
			SAItem.EffectMover=NULL;
		} 
		else 
		{
			SAItem.Time--;
			SAItem.EffectMover->X=X;
			SAItem.EffectMover->Y=Y;
			if (SAItem.Time<SAItem.WarnTime)
				SAItem.EffectMover->Alpha.X=(float)SAItem.Time/SAItem.WarnTime;
		}
	}
*/

	// Berserk
	if ( Player.Valid.Berserk ) 
	{
/*	
		// 버서크상태:
		// 남은 시간이 다 되면 약한 상태로 이동
		if (Berserk.EffectMover) 
		{
			if (Berserk.Time==0) 
			{
				Berserk.EffectMover->Dead=true;
				Berserk.EffectMover=NULL;
				Berserk.State=BS_WEAK;
				Berserk.Time=Berserk.WeakTime;
			} 
			else 
			{
				Berserk.Time--;
				Berserk.EffectMover->X=X;
				Berserk.EffectMover->Y=Y;
				if (Berserk.Time<Berserk.WarnTime)
					Berserk.EffectMover->Alpha.X=(float)Berserk.Time/Berserk.WarnTime;
			}
		} 
		// 약한 상태:
		// 일정 시간이 지나면 통상상태로 이동		
		else if ( Berserk.State==BS_WEAK )
		{			
			if (Berserk.Time==0) 
			{
				Berserk.State=BS_NORMAL;
			} 
			else 
			{
				Berserk.Time--;
			}
		}
*/		
	}
	
	// Throw Other Player
	if ( Player.Valid.Throw )
	{
/*		
		if (is->Button[Throw.ButtonID]) 
		{
			CMoverGroup* mg=GetGroup(MYSHIP_GROUP);
			CMover* mover;
			CHit hit=*Throw.Hit;
			hit.SetPos(X, Y);
			if (mover=mg->FirstHit(&hit)) 
			{
				do 
				{
					if (mover!=this && mover->Valid.Throw && !mover->Throw.Thrown) 
					{
						mover->Throw.Thrown=true;
						mover->Throw.Time=mover->Throw.MaxTime;
					}
				} while (mover=mg->NextHit(&hit));
			}
		}
 */		
	}
/*
	// Enhance By Other Player
	if ( Player.Valid.RFShot && RFShot.Mode==2) 
	{
		
		CMoverGroup* wg=GetGroup(WEAPON_GROUP);
		CMover* mover;
		CHit hit=*RFShot.Hit;
		hit.SetPos(X, Y);
		if (mover=wg->FirstHit(&hit)) 
		{
			do 
			{
				if (mover->Parent!=this) 
				{
					mover->Dead=true;
					New(RFShot.Shot);
				}
			} while (mover=wg->NextHit(&hit));
		}
	}
 */	
	
	// Change Color
	if ( Player.Valid.ChangeColor ) 
	{
/*
		// 바꾸기
		if (!ChangeColor.PrevButton && is->Button[ChangeColor.ButtonID]) 
		{
			Color++;
			if (Color>ChangeColor.NumColor) Color=1;
			New(ChangeColor.Effect[Color-1]);
		}
		ChangeColor.PrevButton=is->Button[ChangeColor.ButtonID];


		// 탄의 흡수
		CMoverGroup* bg=GetGroup(BULLET_GROUP);
		CMover* mover;
		CHit hit=*ChangeColor.Hit;
		hit.SetPos(X, Y);
		if (mover=bg->FirstHit(&hit)) 
		{
			do 
			{
				if (mover->Color==Color) 
				{
					mover->Damage.Vit=0;
				}
			} while (mover=bg->NextHit(&hit));
		}
 */		
	}

	
	// Reflect
	if ( Player.Valid.Reflect ) 
	{		
/*		
		if ( Reflect.FieldMover ) 
		{
			// 탄을 튕겨내기
			Reflect.FieldMover->X=X;
			Reflect.FieldMover->Y=Y;
			CMoverGroup* bg=GetGroup(BULLET_GROUP);
			CMover* mover;
			CHit hit=Reflect.FieldModel->Obj3D->GetHit(HIT_CORE);
			hit.SetPos(X, Y);
			if (mover=bg->FirstHit(&hit)) 
			{
				do 
				{
					mover->Damage.Vit=0;
					New(Reflect.ShotModel);
				} while (mover=bg->NextHit(&hit));
			}

			// 필드를 제거하기
			if ( !is->Button[Reflect.ButtonID]) 
			{
				Reflect.FieldMover->Dead=true;
				Reflect.FieldMover=NULL;
				Damage.Invincible=false;
			}

		} 
		else 
		{
			// 필드를 발동하기
			if (is->Button[Reflect.ButtonID]) {
				Reflect.FieldMover=New(Reflect.FieldModel);
				Damage.Invincible=true;
			}

		}
*/		
	}

/*	
	// Slow & Quick
	int group_speed=0;
	if (Valid.Slow && is->Button[Slow.ButtonID]) {
		group_speed=Slow.Speed;
	}
	if (Valid.Quick && is->Button[Quick.ButtonID]) {
		group_speed=Quick.Speed;
	}
	GetGroup(ENEMY_GROUP)->SetSpeed(group_speed);
	GetGroup(BULLET_GROUP)->SetSpeed(group_speed);
*/
	
	// 자유롭게 움직일 수 있는 조준(스틱)
	if ( Player.Valid.MovableSightS )
	{
/*		
		MOVABLE_SIGHT_S& ms=MovableSightS;
		CMover* sight;
		if (!ms.SightMover) {
			sight=ms.SightMover=New(ms.SightModel);
			sight->X=X+ms.X;
			sight->Y=Y+ms.Y;
		} else {
			sight=ms.SightMover;
			float new_y=sight->Y+ms.Speed*is->AnalogY2;
			if (all_hit.IsInside(sight->X, new_y, screen_hit)) sight->Y=new_y;
			float new_x=sight->X+ms.Speed*is->AnalogX2;
			if (all_hit.IsInside(new_x, sight->Y, screen_hit)) sight->X=new_x;
		}
*/		
	}

	// 자유롭게 움직일 수 있는 조준(버튼)
	if ( Player.Valid.MovableSightB ) 
	{
/*			
		MOVABLE_SIGHT_B& ms=MovableSightB;
		bool button=is->Button[ms.ButtonID];
		float new_x, new_y;
		CMover *sight, *attack;
		switch (ms.State) 
		{

		// 통상상태:
		// 버튼이 눌리면 조준을 꺼내어 조준상태로 이동
		case MSS_NORMAL:
			if (button) {
				ms.State=MSS_SIGHT;
				sight=ms.Mover=New(ms.SightModel);
				sight->X=X+ms.X;
				sight->Y=Y+ms.Y;
			}
			break;

			// 조준상태:
			// 조준을 이동하여 버튼이 떼이지면 공격상태로 이동
		case MSS_SIGHT:
			sight=ms.Mover;				
			new_y=sight->Y+ms.Speed*is->AnalogY;
			if (all_hit.IsInside(sight->X, new_y, screen_hit)) sight->Y=new_y;
			new_x=sight->X+ms.Speed*is->AnalogX;
			if (all_hit.IsInside(new_x, sight->Y, screen_hit)) sight->X=new_x;
			if (!button) {
				ms.State=MSS_ATTACK;
				sight->Damage.Vit=0;
				attack=ms.Mover=New(ms.AttackModel);
				attack->RefCount++;
				attack->X=sight->X;
				attack->Y=sight->Y;
			}
			break;

			// 공격상태:
				// 일정 시간이 경과하면 통상상태로 돌아감
		case MSS_ATTACK:
			attack=ms.Mover;
			if (attack->Dead) {
				ms.State=MSS_NORMAL;
				attack->RefCount--;
			}
			break;
		}
*/		
	}
	
	// Limit Horizontal Scroll
	if ( Player.Valid.LimitedScrollX )
	{
/*		
		CMoverGroup* sg=GetGroup(STAGE_GROUP);
		CMover* bg;
		if (bg=sg->FirstUsed()) {
			do {
				if (bg->Valid.Bg) {
					bg->Bg.SX=X*(bg->Bg.MW*bg->Bg.CW-bg->Bg.SW)/bg->Bg.SW;
				}
			} while (bg=sg->NextUsed());
		}
*/		
	}
	
	// Control Vertical Scroll
	if ( Player.Valid.ControlScrollY ) 
	{
/*		
		CONTROL_SCROLL_Y& cs=ControlScrollY;
		CMoverGroup* sg=GetGroup(STAGE_GROUP);
		CMover* bg;
		float yt=cs.YTop, yb=cs.YBottom, st=cs.SVYTop, sb=cs.SVYBottom;
		float svy=st+(Y-yt)*(sb-st)/(yb-yt);
		if (bg=sg->FirstUsed()) {
			do {
				if (bg->Valid.Bg) bg->Bg.SVY=svy;
			} while (bg=sg->NextUsed());
		}
 */			
	}
};