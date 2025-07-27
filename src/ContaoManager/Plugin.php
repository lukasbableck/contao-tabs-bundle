<?php
namespace Lukasbableck\ContaoTabsBundle\ContaoManager;

use Contao\CoreBundle\ContaoCoreBundle;
use Contao\ManagerPlugin\Bundle\BundlePluginInterface;
use Contao\ManagerPlugin\Bundle\Config\BundleConfig;
use Contao\ManagerPlugin\Bundle\Parser\ParserInterface;
use Contao\ManagerPlugin\Routing\RoutingPluginInterface;
use Lukasbableck\ContaoTabsBundle\ContaoTabsBundle;
use Symfony\Component\Config\Loader\LoaderResolverInterface;
use Symfony\Component\HttpKernel\KernelInterface;

class Plugin implements BundlePluginInterface, RoutingPluginInterface {
	public function getBundles(ParserInterface $parser): array {
		return [BundleConfig::create(ContaoTabsBundle::class)->setLoadAfter([ContaoCoreBundle::class])];
	}

	public function getRouteCollection(LoaderResolverInterface $resolver, KernelInterface $kernel) {
		return $resolver
			->resolve(__DIR__.'/../Controller', 'attribute')
			->load(__DIR__.'/../Controller')
		;
	}
}
