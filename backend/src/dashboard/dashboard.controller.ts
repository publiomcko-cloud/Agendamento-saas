import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.attendant)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna o resumo operacional do dia' })
  getSummary(
    @Query() query: DashboardQueryDto,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.dashboardService.getSummary(query, currentUser);
  }
}
